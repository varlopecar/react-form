"""
User Management FastAPI Application
Production-ready API for user registration, authentication, and management.

Endpoints:
- POST /register - Register a new user
- POST /login - User login with JWT token
- GET /users - Get all users (admin only)
- GET /public-users - Get public list of users
- DELETE /users/{user_id} - Delete user (admin only)
- GET /health - Health check
"""

import os
import jwt
import bcrypt
import logging
import mysql.connector
from mysql.connector import Error
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from datetime import date

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global database connection pool
db_pool = None

# Security configuration
security = HTTPBearer()
MY_SECRET = os.getenv("JWT_SECRET", "dev-secret")

# Pydantic models for request/response validation
class UserRegister(BaseModel):
    last_name: str = Field(..., min_length=1, max_length=100, description="User's last name")
    first_name: str = Field(..., min_length=1, max_length=100, description="User's first name")
    email: EmailStr = Field(..., description="User's email address")
    birth_date: date = Field(..., description="User's birth date")
    city: str = Field(..., min_length=1, max_length=100, description="User's city")
    postal_code: str = Field(..., min_length=1, max_length=20, description="User's postal code")
    password: str = Field(..., min_length=6, max_length=100, description="User's password")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")

class UserResponse(BaseModel):
    id: int
    last_name: str
    first_name: str
    email: str
    birth_date: date
    city: str
    postal_code: str
    role: str
    is_admin: bool
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class RegisterResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    user: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class LoginResponse(BaseModel):
    success: bool
    access_token: Optional[str] = None
    token_type: Optional[str] = None
    user: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    database: str
    timestamp: str
    error: Optional[str] = None

# Database functions
def get_connection():
    """Get MySQL database connection"""
    try:
        logger.info(f"Attempting to connect to database: {os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_DATABASE')}")
        
        connection = mysql.connector.connect(
            database=os.getenv("MYSQL_DATABASE"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            port=3306,
            host=os.getenv("MYSQL_HOST"),
            autocommit=True,
            connect_timeout=10
        )
        
        if connection.is_connected():
            logger.info("Database connection established successfully")
            return connection
        else:
            logger.error("Failed to establish database connection")
            return None
            
    except Error as err:
        logger.error(f"Database connection error: {err}")
        return None
    except Exception as err:
        logger.error(f"Unexpected error during database connection: {err}")
        return None

def create_admin_user():
    """Create admin user if not exists"""
    conn = None
    cursor = None
    try:
        logger.info("Attempting to create admin user")
        
        conn = get_connection()
        if not conn or not conn.is_connected():
            logger.error("Cannot create admin user: database connection failed")
            return
            
        cursor = conn.cursor(dictionary=True)

        # Check if admin exists
        cursor.execute("SELECT * FROM users WHERE role = 'admin'")
        admin_exists = cursor.fetchone()

        if not admin_exists:
            admin_email = os.getenv("ADMIN_EMAIL")
            admin_password = os.getenv("ADMIN_PASSWORD")

            if admin_email and admin_password:
                # Hash password
                hashed_password = hash_password(admin_password)

                # Insert admin user
                sql = """
                    INSERT INTO users (last_name, first_name, email, password, birth_date, city, postal_code, role) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """
                values = ("Goat", "Loïse", admin_email, hashed_password,
                          "1990-01-01", "Admin City", "00000", "admin")
                cursor.execute(sql, values)
                conn.commit()
                logger.info(f"Admin user created with email: {admin_email}")
            else:
                logger.warning("Admin email or password not configured in environment variables")
        else:
            logger.info("Admin user already exists")

    except Error as err:
        logger.error(f"Error creating admin user: {err}")
    except Exception as err:
        logger.error(f"Unexpected error creating admin user: {err}")
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

# Authentication functions
def create_jwt_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT token with optional expiration"""
    try:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(hours=24)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, MY_SECRET, algorithm="HS256")
        logger.info(f"JWT token created for user: {data.get('email', 'unknown')}")
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error creating JWT token: {e}")
        raise HTTPException(status_code=500, detail="Token creation failed")

def verify_jwt_token(token: str):
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, MY_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("JWT token expired")
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError as e:
        logger.warning(f"Invalid JWT token: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"Error verifying JWT token: {e}")
        raise HTTPException(status_code=401, detail="Token verification failed")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    try:
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        return hashed.decode('utf-8')
    except Exception as e:
        logger.error(f"Error hashing password: {e}")
        raise Exception("Password hashing failed")

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception as e:
        logger.error(f"Error verifying password: {e}")
        return False

# Authentication dependencies
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    try:
        token = credentials.credentials
        payload = verify_jwt_token(token)
        return payload
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")

def get_current_admin(current_user: dict = Depends(get_current_user)):
    """Get current admin user - requires admin role"""
    try:
        if current_user.get("role") != "admin":
            logger.warning(f"Non-admin user attempted admin access: {current_user.get('email', 'unknown')}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        return current_user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking admin access: {e}")
        raise HTTPException(status_code=403, detail="Admin access verification failed")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize the application when it starts."""
    try:
        logger.info("Starting application initialization...")
        
        # Create admin user
        create_admin_user()
        
        logger.info("Application initialization completed successfully")
    except Exception as e:
        logger.error(f"Error during application initialization: {e}")
    
    yield

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="User Management API",
    description="API for user registration, authentication, and management",
    version="1.0.0",
    lifespan=lifespan
)

# Get CORS origins from environment variable or use defaults
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,https://varlopecar.github.io,https://python-api-six-indol.vercel.app")
cors_origins_list = [origin.strip() for origin in cors_origins.split(",")]

# Add additional common development and production origins
additional_origins = [
    "http://localhost:8080",
    "http://localhost:4173",  # Vite preview
    "http://localhost:5000",  # Flask default
    "http://localhost:8000",  # FastAPI default
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:8000",
    "*"  # Allow all origins for now to debug CORS issues
]

# Combine all origins
all_origins = cors_origins_list + additional_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=all_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# API Routes
@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "User Management API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": "register: POST /register - Register new user; login: POST /login - User login; users: GET /users - Get all users (admin); public-users: GET /public-users - Get public users; health: GET /health - Health check"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint to verify API and database status"""
    try:
        # Test database connection
        conn = get_connection()
        if conn and conn.is_connected():
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchone()
            cursor.close()
            conn.close()
            db_status = "healthy"
        else:
            db_status = "unhealthy"
            
        return HealthResponse(
            status="healthy",
            database=db_status,
            timestamp="2024-01-01T00:00:00Z"
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return HealthResponse(
            status="unhealthy",
            database="unhealthy",
            error=str(e),
            timestamp="2024-01-01T00:00:00Z"
        )

@app.post("/register", response_model=RegisterResponse)
async def register_user(user_data: UserRegister):
    """Register a new user"""
    conn = None
    cursor = None
    try:
        logger.info(f"Attempting to register user: {user_data.email}")
        
        conn = get_connection()
        if not conn or not conn.is_connected():
            logger.error("Failed to establish database connection")
            return RegisterResponse(
                success=False,
                error="Database connection failed"
            )
        
        cursor = conn.cursor(dictionary=True)
        
        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (user_data.email,))
        if cursor.fetchone():
            return RegisterResponse(
                success=False,
                error="Email already registered"
            )
        
        # Hash the password
        try:
            hashed_password = hash_password(user_data.password)
        except Exception as e:
            logger.error(f"Password hashing failed: {e}")
            return RegisterResponse(
                success=False,
                error="Password processing failed"
            )
        
        # Insert new user with hashed password
        sql = """
            INSERT INTO users (last_name, first_name, email, password, birth_date, city, postal_code, role) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            user_data.last_name,
            user_data.first_name,
            user_data.email,
            hashed_password,
            user_data.birth_date,
            user_data.city,
            user_data.postal_code,
            "user"
        )
        cursor.execute(sql, values)
        conn.commit()
        
        # Get the inserted user data
        user_id = cursor.lastrowid
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        new_user = cursor.fetchone()
        
        logger.info(f"User registered successfully: {user_data.email}")
        
        return RegisterResponse(
            success=True,
            message="Inscription réussie !",
            user={
                "id": new_user['id'],
                "email": new_user['email'],
                "first_name": new_user['first_name'],
                "last_name": new_user['last_name'],
                "is_admin": new_user['role'] == 'admin'
            }
        )
        
    except mysql.connector.Error as err:
        logger.error(f"Database error during registration: {err}")
        return RegisterResponse(
            success=False,
            error=f"Database error: {str(err)}"
        )
    except Exception as err:
        logger.error(f"Unexpected error during registration: {err}")
        return RegisterResponse(
            success=False,
            error="Internal server error"
        )
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

@app.get("/public-users", response_model=List[Dict[str, str]])
async def get_public_users():
    """Get public list of users (first names only)"""
    conn = None
    cursor = None
    try:
        conn = get_connection()
        if not conn or not conn.is_connected():
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT first_name FROM users ORDER BY first_name")
        users = cursor.fetchall()
        return users
        
    except mysql.connector.Error as err:
        logger.error(f"Database error getting public users: {err}")
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

@app.post("/login", response_model=LoginResponse)
async def login_user(user_data: UserLogin):
    """Login user and return JWT token"""
    conn = None
    cursor = None
    try:
        logger.info(f"Attempting login for user: {user_data.email}")
        
        conn = get_connection()
        if not conn or not conn.is_connected():
            logger.error("Failed to establish database connection")
            return LoginResponse(
                success=False,
                error="Database connection failed"
            )
        
        cursor = conn.cursor(dictionary=True)
        
        # Get user by email
        cursor.execute("SELECT * FROM users WHERE email = %s", (user_data.email,))
        user = cursor.fetchone()
        
        if not user:
            return LoginResponse(
                success=False,
                error="Invalid credentials"
            )
        
        # Verify password
        if not verify_password(user_data.password, user['password']):
            return LoginResponse(
                success=False,
                error="Invalid credentials"
            )
        
        # Create JWT token
        token_data = {
            "user_id": user['id'],
            "email": user['email'],
            "role": user['role']
        }
        token = create_jwt_token(token_data)
        
        logger.info(f"User logged in successfully: {user_data.email}")
        
        return LoginResponse(
            success=True,
            access_token=token,
            token_type="bearer",
            user={
                "id": user['id'],
                "last_name": user['last_name'],
                "first_name": user['first_name'],
                "email": user['email'],
                "birth_date": user['birth_date'],
                "city": user['city'],
                "postal_code": user['postal_code'],
                "is_admin": user['role'] == 'admin',
                "created_at": user.get('created_at', '2024-01-01T00:00:00Z'),
                "updated_at": user.get('updated_at', '2024-01-01T00:00:00Z')
            }
        )
        
    except mysql.connector.Error as err:
        logger.error(f"Database error during login: {err}")
        return LoginResponse(
            success=False,
            error=f"Database error: {str(err)}"
        )
    except Exception as err:
        logger.error(f"Unexpected error during login: {err}")
        return LoginResponse(
            success=False,
            error="Internal server error"
        )
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

@app.get("/users", response_model=List[UserResponse])
async def get_users(current_admin: dict = Depends(get_current_admin)):
    """Get all users (admin only)"""
    conn = None
    cursor = None
    try:
        conn = get_connection()
        if not conn or not conn.is_connected():
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, last_name, first_name, email, birth_date, city, postal_code, role, created_at, updated_at FROM users")
        users = cursor.fetchall()
        
        # Transform users to match frontend expectations
        transformed_users = []
        for user in users:
            transformed_users.append(UserResponse(
                id=user['id'],
                last_name=user['last_name'],
                first_name=user['first_name'],
                email=user['email'],
                birth_date=user['birth_date'],
                city=user['city'],
                postal_code=user['postal_code'],
                role=user['role'],
                is_admin=user['role'] == 'admin',
                created_at=user.get('created_at', '2024-01-01T00:00:00Z'),
                updated_at=user.get('updated_at', '2024-01-01T00:00:00Z')
            ))
        
        return transformed_users
        
    except mysql.connector.Error as err:
        logger.error(f"Database error getting users: {err}")
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

@app.delete("/users/{user_id}")
async def delete_user(user_id: int, current_admin: dict = Depends(get_current_admin)):
    """Delete a user (admin only)"""
    conn = None
    cursor = None
    try:
        conn = get_connection()
        if not conn or not conn.is_connected():
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        cursor = conn.cursor(dictionary=True)
        
        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Delete user
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()
        
        return {"message": f"User {user_id} deleted successfully"}
        
    except mysql.connector.Error as err:
        logger.error(f"Database error deleting user: {err}")
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

if __name__ == "__main__":
    import uvicorn
    
    # Run the FastAPI application
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    log_level = os.environ.get("LOG_LEVEL", "info")

    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        reload=False,  # Disable reload in production
        log_level=log_level
    )