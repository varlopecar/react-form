from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import text
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import List, Optional
import os
from pydantic_settings import BaseSettings

from database import get_db, engine
from models import Base, User
from schemas import UserCreate, UserResponse, UserLogin, Token

# Create database tables
Base.metadata.create_all(bind=engine)


class Settings(BaseSettings):
    secret_key: str = "your-secret-key-here"
    admin_email: str = "admin@example.com"
    admin_password: str = "admin123"
    cors_origins: str = "http://localhost:3000,http://localhost:5173,http://localhost:8080,http://127.0.0.1:3000,http://127.0.0.1:5173,http://127.0.0.1:8080"

    class Config:
        env_file = "../.env"
        env_prefix = ""
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields in .env file


settings = Settings()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token
security = HTTPBearer()

app = FastAPI(title="User Registration API", version="1.0.0")

# CORS middleware configuration
cors_origins = [origin.strip()
                for origin in settings.cors_origins.split(",") if origin.strip()]

print(f"🔧 CORS Origins configured: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    # In a real app, you'd use JWT here
    return to_encode


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    # In a real app, you'd verify JWT token here
    # For simplicity, we'll use a simple token check
    token = credentials.credentials
    user = db.query(User).filter(User.email == token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def create_admin_user():
    """Create admin user if it doesn't exist"""
    db = next(get_db())
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(
            User.email == settings.admin_email).first()

        if not admin_user:
            # Create admin user
            hashed_password = get_password_hash(settings.admin_password)
            admin_user = User(
                email=settings.admin_email,
                password=hashed_password,
                first_name="Admin",
                last_name="User",
                birth_date=datetime(1990, 1, 1).date(),
                city="Paris",
                postal_code="75001",
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            print(f"✅ Admin user created: {settings.admin_email}")
        else:
            print(f"✅ Admin user already exists: {settings.admin_email}")

    except Exception as e:
        print(f"❌ Error with admin user: {e}")
        db.rollback()
        raise
    finally:
        db.close()


# Create admin user on startup
@app.on_event("startup")
async def startup_event():
    create_admin_user()


@app.get("/")
def read_root():
    return {"message": "User Registration API is running!"}


@app.get("/health")
def health_check():
    try:
        # Test database connection
        db = next(get_db())
        db.execute(text("SELECT 1"))
        db.close()
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "message": "Backend is running successfully!",
            "database": "connected",
            "cors_origins": cors_origins
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": datetime.utcnow().isoformat(),
            "message": f"Database connection failed: {str(e)}",
            "database": "disconnected",
            "cors_origins": cors_origins
        }


@app.get("/cors-debug")
def cors_debug():
    """Debug endpoint to check CORS configuration"""
    return {
        "cors_origins": cors_origins,
        "cors_origins_count": len(cors_origins),
        "timestamp": datetime.utcnow().isoformat(),
        "message": "CORS configuration debug info"
    }


@app.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        birth_date=user.birth_date,
        city=user.city,
        postal_code=user.postal_code,
        role="user"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(
            User.email == user_credentials.email).first()
        if not user or not verify_password(user_credentials.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        return {"access_token": user.email, "token_type": "bearer"}
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )


@app.get("/users", response_model=List[UserResponse])
def get_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    users = db.query(User).all()
    return users


@app.delete("/users/{user_id}")
def delete_user(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_admin:
        raise HTTPException(status_code=400, detail="Cannot delete admin user")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


@app.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
