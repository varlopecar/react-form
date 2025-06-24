#!/usr/bin/env python3
"""
Test script to verify environment file selection
"""
import os
import sys


def get_env_file():
    """Determine which environment file to use based on environment"""
    # Check for explicit environment setting
    if os.getenv("NODE_ENV") == "production" or os.getenv("ENVIRONMENT") == "production":
        return ".env.production"
    elif os.getenv("VERCEL_ENV") or os.getenv("RAILWAY_ENVIRONMENT"):
        # Vercel and Railway deployments
        return ".env.production"
    else:
        # Default to local development
        return ".env"


def test_env_file_selection():
    """Test environment file selection logic"""
    print("Testing environment file selection...")

    # Test cases
    test_cases = [
        ({"NODE_ENV": "production"}, ".env.production"),
        ({"ENVIRONMENT": "production"}, ".env.production"),
        ({"VERCEL_ENV": "production"}, ".env.production"),
        ({"RAILWAY_ENVIRONMENT": "production"}, ".env.production"),
        ({}, ".env"),  # Default case
        ({"NODE_ENV": "development"}, ".env"),
    ]

    for env_vars, expected_file in test_cases:
        # Set environment variables for this test
        original_env = {}
        for key, value in env_vars.items():
            original_env[key] = os.getenv(key)
            os.environ[key] = value

        # Test the function
        result = get_env_file()
        print(
            f"Environment: {env_vars} -> Expected: {expected_file}, Got: {result}")

        # Restore original environment
        for key, value in original_env.items():
            if value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = value

    print("\n✅ Environment file selection test completed")


def test_database_settings():
    """Test database settings loading"""
    print("\nTesting database settings loading...")

    try:
        from database import db_settings, DATABASE_URL
        print(
            f"Database URL: {DATABASE_URL[:50] if DATABASE_URL else 'None'}...")
        print(f"MySQL User: {db_settings.MYSQL_USER}")
        print(f"MySQL Host: {db_settings.MYSQL_HOST}")
        print(f"MySQL Database: {db_settings.MYSQL_DATABASE}")
        print("✅ Database settings loaded successfully")
    except Exception as e:
        print(f"❌ Error loading database settings: {e}")


def test_main_settings():
    """Test main settings loading"""
    print("\nTesting main settings loading...")

    try:
        from main import settings
        print(f"Admin Email: {settings.admin_email}")
        print(f"CORS Origins: {settings.cors_origins}")
        print("✅ Main settings loaded successfully")
    except Exception as e:
        print(f"❌ Error loading main settings: {e}")


if __name__ == "__main__":
    test_env_file_selection()
    test_database_settings()
    test_main_settings()
    print("\n🎉 All tests completed!")
