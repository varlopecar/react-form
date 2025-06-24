from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import time
from sqlalchemy.exc import OperationalError

# Get database URL from environment variable or construct from individual components
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback to individual environment variables
    MYSQL_USER = os.getenv("MYSQL_USER", "react_user")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "react_password")
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "react_form_db")
    # Use service name in Docker Compose
    MYSQL_HOST = os.getenv("MYSQL_HOST", "mysql")
    
    # Construct database URL
    DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:3306/{MYSQL_DATABASE}"
else:
    # Ensure the database URL uses pymysql driver
    if DATABASE_URL.startswith("mysql://"):
        DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

print(f"Using database URL: {DATABASE_URL[:50]}...")


def create_engine_with_retry():
    """Create SQLAlchemy engine with retry logic for MySQL connection"""
    max_retries = 5
    retry_delay = 2

    for attempt in range(max_retries):
        try:
            engine = create_engine(DATABASE_URL)
            # Test the connection
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print(f"Database connection successful on attempt {attempt + 1}")
            return engine
        except OperationalError as e:
            if attempt < max_retries - 1:
                print(
                    f"Database connection failed on attempt {attempt + 1}, retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
            else:
                print(
                    f"Failed to connect to database after {max_retries} attempts")
                raise e


# Create SQLAlchemy engine with retry logic
engine = create_engine_with_retry()

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get database session


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
