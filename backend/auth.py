import os
import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Optional

from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Security configuration
security = HTTPBearer()
MY_SECRET = os.getenv("JWT_SECRET", "dev-secret")

# JWT token functions
def create_jwt_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT token with optional expiration"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, MY_SECRET, algorithm="HS256")
    return encoded_jwt

def verify_jwt_token(token: str):
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, MY_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Password hashing functions
def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

# Authentication dependencies
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    token = credentials.credentials
    payload = verify_jwt_token(token)
    return payload

def get_current_admin(current_user: dict = Depends(get_current_user)):
    """Get current admin user - requires admin role"""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user 