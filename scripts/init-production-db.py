#!/usr/bin/env python3
"""
Production Database Initialization Script
This script sets up the production database with tables and admin user.
"""

import os
import sys
import mysql.connector
from mysql.connector import Error
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_database_connection():
    """Get database connection from environment variables."""
    try:
        # Parse DATABASE_URL
        database_url = os.getenv('DATABASE_URL')
        if not database_url:
            print("❌ DATABASE_URL environment variable not set")
            sys.exit(1)

        # Extract connection details from DATABASE_URL
        # Format: mysql+pymysql://username:password@host:port/database
        parts = database_url.replace('mysql+pymysql://', '').split('@')
        credentials = parts[0].split(':')
        host_port_db = parts[1].split('/')
        host_port = host_port_db[0].split(':')

        username = credentials[0]
        password = credentials[1]
        host = host_port[0]
        port = int(host_port[1]) if len(host_port) > 1 else 3306
        database = host_port_db[1]

        connection = mysql.connector.connect(
            host=host,
            port=port,
            user=username,
            password=password,
            database=database
        )

        if connection.is_connected():
            print(f"✅ Connected to MySQL database: {database}")
            return connection

    except Error as e:
        print(f"❌ Error connecting to MySQL: {e}")
        sys.exit(1)


def create_tables(connection):
    """Create the users table if it doesn't exist."""
    try:
        cursor = connection.cursor()

        create_table_query = """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            birth_date DATE NOT NULL,
            city VARCHAR(100) NOT NULL,
            postal_code VARCHAR(10) NOT NULL,
            is_admin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        """

        cursor.execute(create_table_query)
        connection.commit()
        print("✅ Users table created successfully")

    except Error as e:
        print(f"❌ Error creating table: {e}")
        sys.exit(1)


def create_admin_user(connection):
    """Create admin user if it doesn't exist."""
    try:
        cursor = connection.cursor()

        # Get admin credentials from environment
        admin_email = os.getenv('ADMIN_EMAIL', 'admin@example.com')
        admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')

        # Hash the password
        hashed_password = pwd_context.hash(admin_password)

        # Check if admin user already exists
        check_query = "SELECT id FROM users WHERE email = %s"
        cursor.execute(check_query, (admin_email,))
        result = cursor.fetchone()

        if result:
            print(f"✅ Admin user already exists: {admin_email}")
            return

        # Create admin user
        insert_query = """
        INSERT INTO users (email, password, first_name, last_name, birth_date, city, postal_code, is_admin) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        admin_data = (
            admin_email,
            hashed_password,
            'Admin',
            'User',
            '1990-01-01',
            'Paris',
            '75001',
            True
        )

        cursor.execute(insert_query, admin_data)
        connection.commit()
        print(f"✅ Admin user created successfully: {admin_email}")

    except Error as e:
        print(f"❌ Error creating admin user: {e}")
        sys.exit(1)


def main():
    """Main function to initialize the production database."""
    print("🚀 Initializing Production Database...")

    # Get database connection
    connection = get_database_connection()

    try:
        # Create tables
        create_tables(connection)

        # Create admin user
        create_admin_user(connection)

        print("🎉 Production database initialized successfully!")
        print("\n📋 Admin credentials:")
        print(f"   Email: {os.getenv('ADMIN_EMAIL', 'admin@example.com')}")
        print(f"   Password: {os.getenv('ADMIN_PASSWORD', 'admin123')}")

    finally:
        if connection.is_connected():
            connection.close()
            print("✅ Database connection closed")


if __name__ == "__main__":
    main()
