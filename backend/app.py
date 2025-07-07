import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector

from models import UserRegister, UserLogin, UserResponse
from auth import create_jwt_token, verify_password, get_current_admin
from database import get_connection, create_admin_user

app = FastAPI(title="User Management API", version="1.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://enzocasalini.github.io",
        "https://integ-deploiement.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_event():
    create_admin_user()

# Routes
@app.post("/register", response_model=dict)
def register_user(user_data: UserRegister):
    """Register a new user"""
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (user_data.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Insert new user (without password for registration)
        sql = """
            INSERT INTO users (last_name, first_name, email, birth_date, city, postal_code, role) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            user_data.last_name,
            user_data.first_name,
            user_data.email,
            user_data.birth_date,
            user_data.city,
            user_data.postal_code,
            "user"
        )
        cursor.execute(sql, values)
        conn.commit()
        
        return {"message": "Inscription réussie !"}
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.get("/public-users")
def get_public_users():
    """Get public list of users (first names only)"""
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT first_name FROM users ORDER BY first_name")
        users = cursor.fetchall()
        
        return users
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.post("/login", response_model=dict)
def login_user(user_data: UserLogin):
    """Login user and return JWT token"""
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get user by email
        cursor.execute("SELECT * FROM users WHERE email = %s", (user_data.email,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password
        if not verify_password(user_data.password, user['password']):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create JWT token
        token_data = {
            "user_id": user['id'],
            "email": user['email'],
            "role": user['role']
        }
        token = create_jwt_token(token_data)
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user['id'],
                "last_name": user['last_name'],
                "first_name": user['first_name'],
                "email": user['email'],
                "birth_date": user['birth_date'],
                "city": user['city'],
                "postal_code": user['postal_code'],
                "role": user['role']
            }
        }
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.get("/users", response_model=list[UserResponse])
def get_users(current_admin: dict = Depends(get_current_admin)):
    """Get all users (admin only)"""
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT id, last_name, first_name, email, birth_date, city, postal_code, role FROM users")
        users = cursor.fetchall()
        
        return users
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.delete("/users/{user_id}")
def delete_user(user_id: int, current_admin: dict = Depends(get_current_admin)):
    """Delete a user (admin only)"""
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if user exists
        cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="User not found")
        
        # Delete user
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()
        
        return {"message": f"User {user_id} deleted successfully"}
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.get("/")
def read_root():
    return {"message": "User Management API is running"}