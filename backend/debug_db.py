#!/usr/bin/env python3
"""
Debug script to test database connection and environment variables
"""
import os
import sys
from database import DATABASE_URL, engine, get_db
from sqlalchemy import text


def test_environment():
    """Test environment variables"""
    print("=== Environment Variables ===")
    print(f"VERCEL_ENV: {os.getenv('VERCEL_ENV')}")
    print(f"NODE_ENV: {os.getenv('NODE_ENV')}")
    print(f"ENVIRONMENT: {os.getenv('ENVIRONMENT')}")
    print(
        f"DATABASE_URL: {os.getenv('DATABASE_URL', 'Not set')[:50] if os.getenv('DATABASE_URL') else 'Not set'}...")
    print(f"CORS_ORIGINS: {os.getenv('CORS_ORIGINS')}")
    print()


def test_database_connection():
    """Test database connection"""
    print("=== Database Connection Test ===")
    print(
        f"Using DATABASE_URL: {DATABASE_URL[:50] if DATABASE_URL else 'None'}...")

    try:
        # Test engine connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            print(f"Test query result: {result.fetchone()}")
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        return False

    try:
        # Test session
        db = next(get_db())
        result = db.execute(text("SELECT 1"))
        print("✅ Database session successful!")
        db.close()
    except Exception as e:
        print(f"❌ Database session failed: {str(e)}")
        return False

    return True


def test_tables():
    """Test if tables exist"""
    print("\n=== Table Test ===")
    try:
        db = next(get_db())
        # Test if User table exists
        result = db.execute(text("SHOW TABLES"))
        tables = [row[0] for row in result.fetchall()]
        print(f"Available tables: {tables}")

        if 'user' in tables:
            # Count users
            result = db.execute(text("SELECT COUNT(*) FROM user"))
            count = result.fetchone()[0]
            print(f"Number of users in database: {count}")
        else:
            print("❌ User table not found!")

        db.close()
    except Exception as e:
        print(f"❌ Table test failed: {str(e)}")


if __name__ == "__main__":
    test_environment()
    if test_database_connection():
        test_tables()
    else:
        print("\n❌ Database connection failed. Please check your DATABASE_URL and database configuration.")
        sys.exit(1)
