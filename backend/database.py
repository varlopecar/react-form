from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import time
from sqlalchemy.exc import OperationalError
import urllib.parse
from pydantic_settings import BaseSettings
from typing import Optional


def get_env_file():
    """Determine which environment file to use based on environment"""
    # Check for explicit environment setting
    if os.getenv("NODE_ENV") == "production" or os.getenv("ENVIRONMENT") == "production":
        return ".env.production"
    elif os.getenv("VERCEL_ENV"):
        # Vercel deployments
        return ".env.production"
    else:
        # Default to local development
        return ".env"


class DatabaseSettings(BaseSettings):
    """Database settings with proper environment file handling"""
    DATABASE_URL: Optional[str] = None
    MYSQL_USER: str = "react_user"
    MYSQL_PASSWORD: str = "react_password"
    MYSQL_DATABASE: str = "react_form_db"
    MYSQL_HOST: str = "mysql"

    class Config:
        env_file = get_env_file()
        env_prefix = ""
        case_sensitive = False
        # Allow missing env files
        env_file_encoding = 'utf-8'
        # Make DATABASE_URL optional
        extra = "ignore"


def get_ssl_config(database_url):
    """Get appropriate SSL configuration based on database provider"""
    if not database_url:
        return {}

    url_lower = database_url.lower()

    # PlanetScale
    if 'planetscale' in url_lower:
        return {
            "ssl": {
                "ssl_mode": "VERIFY_IDENTITY",
                "ssl_ca": "/etc/ssl/certs/ca-certificates.crt"
            }
        }

    # Railway
    elif 'railway' in url_lower:
        return {
            "ssl": {
                "ssl_mode": "REQUIRED"
            }
        }

    # Vercel
    elif 'vercel' in url_lower:
        return {
            "ssl": {
                "ssl_mode": "REQUIRED"
            }
        }

    # Heroku
    elif 'heroku' in url_lower:
        return {
            "ssl": {
                "ssl_mode": "REQUIRED"
            }
        }

    # Clever Cloud
    elif 'clever-cloud' in url_lower:
        return {
            "ssl": {
                "ssl_mode": "REQUIRED"
            }
        }

    # Aiven Cloud (your production database)
    elif 'aivencloud' in url_lower:
        return {
            "ssl": {
                "ssl_mode": "REQUIRED"
            }
        }

    # RocketAdmin
    elif 'rocketadmin' in url_lower or 'rocket-admin' in url_lower:
        return {
            "ssl": {
                "ssl_mode": "REQUIRED"
            }
        }

    # Default: no SSL for local development
    return {}


# Get database settings with proper environment file handling
db_settings = DatabaseSettings()

# Get database URL from environment variable or construct from individual components
DATABASE_URL = db_settings.DATABASE_URL

if not DATABASE_URL:
    # Fallback to individual environment variables (local development)
    MYSQL_USER = db_settings.MYSQL_USER or "react_user"
    MYSQL_PASSWORD = db_settings.MYSQL_PASSWORD or "react_password"
    MYSQL_DATABASE = db_settings.MYSQL_DATABASE or "react_form_db"
    MYSQL_HOST = db_settings.MYSQL_HOST or "mysql"

    # Construct database URL
    DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:3306/{MYSQL_DATABASE}"
    print("Using local database configuration")
else:
    # Ensure the database URL uses pymysql driver
    if DATABASE_URL.startswith("mysql://"):
        DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

    # Remove any ssl-mode parameters from the URL that might cause issues
    if "ssl-mode=" in DATABASE_URL:
        # Parse the URL to remove ssl-mode parameter
        parsed = urllib.parse.urlparse(DATABASE_URL)
        query_params = urllib.parse.parse_qs(parsed.query)

        # Remove ssl-mode from query parameters
        if 'ssl-mode' in query_params:
            del query_params['ssl-mode']

        # Reconstruct the URL without ssl-mode
        new_query = urllib.parse.urlencode(query_params, doseq=True)
        DATABASE_URL = urllib.parse.urlunparse((
            parsed.scheme,
            parsed.netloc,
            parsed.path,
            parsed.params,
            new_query if new_query else None,
            parsed.fragment
        ))
        print("Removed ssl-mode parameter from DATABASE_URL")

    print("Using production database configuration")

print(f"Using database URL: {DATABASE_URL[:50]}...")


def create_engine_with_retry():
    """Create SQLAlchemy engine with retry logic for MySQL connection"""
    max_retries = 5
    retry_delay = 2

    for attempt in range(max_retries):
        try:
            # Get SSL configuration based on database provider
            connect_args = get_ssl_config(DATABASE_URL)

            engine = create_engine(
                DATABASE_URL,
                connect_args=connect_args,
                pool_pre_ping=True,
                pool_recycle=300
            )

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
    except Exception as e:
        print(f"Database session error: {str(e)}")
        db.rollback()
        raise e
    finally:
        db.close()
