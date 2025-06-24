#!/usr/bin/env python3
"""
Database Seeding Script
This script creates the admin user with the correct credentials.
"""

from models import Base, User
from database import get_db, engine
import sys
import os
from datetime import datetime
from passlib.context import CryptContext

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Admin credentials (matching main.py)
ADMIN_EMAIL = "loise.fenoll@ynov.com"
ADMIN_PASSWORD = "PvdrTAzTeR247sDnAZBr"


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def create_admin_user():
    """Create admin user if it doesn't exist"""
    print("🔧 Creating admin user...")

    db = next(get_db())
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.email == ADMIN_EMAIL).first()

        if admin_user:
            print(f"✅ Admin user already exists: {ADMIN_EMAIL}")
            return admin_user

        # Create admin user
        hashed_password = get_password_hash(ADMIN_PASSWORD)
        admin_user = User(
            email=ADMIN_EMAIL,
            password=hashed_password,
            first_name="Loise",
            last_name="Fenoll",
            birth_date=datetime(1990, 1, 1).date(),
            city="Paris",
            postal_code="75001",
            is_admin=True
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print(f"✅ Admin user created successfully: {ADMIN_EMAIL}")
        print(f"   Password: {ADMIN_PASSWORD}")
        return admin_user

    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def create_tables():
    """Create database tables if they don't exist"""
    print("🔧 Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        raise


def main():
    """Main function to seed the database"""
    print("🚀 Seeding Database...")

    try:
        # Create tables
        create_tables()

        # Create admin user
        admin_user = create_admin_user()

        print("\n🎉 Database seeded successfully!")
        print("\n📋 Admin credentials:")
        print(f"   Email: {ADMIN_EMAIL}")
        print(f"   Password: {ADMIN_PASSWORD}")
        print(f"   Is Admin: {admin_user.is_admin if admin_user else 'N/A'}")

    except Exception as e:
        print(f"❌ Failed to seed database: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
