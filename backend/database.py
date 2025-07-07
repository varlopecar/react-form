from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from pydantic_settings import BaseSettings


class DatabaseSettings(BaseSettings):
    """Database settings"""
    MYSQL_USER: str = "user"
    MYSQL_PASSWORD: str = "password"
    MYSQL_DATABASE: str = "user_registration"
    MYSQL_HOST: str = "mysql"

    class Config:
        env_file = "../.env"
        env_prefix = ""
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields in .env file


# Get database settings
db_settings = DatabaseSettings()

# Create database URL
DATABASE_URL = f"mysql+pymysql://{db_settings.MYSQL_USER}:{db_settings.MYSQL_PASSWORD}@{db_settings.MYSQL_HOST}/{db_settings.MYSQL_DATABASE}"

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

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
