#!/usr/bin/env python3
"""
Database initialization script
Runs the SQL migration files to set up the database
"""

import os
import sys
from sqlalchemy import create_engine, text
from database import db_settings


def init_database():
    """Initialize the database using SQL migration files"""

    # Create connection to MySQL server (without database)
    server_url = f"mysql+pymysql://{db_settings.MYSQL_USER}:{db_settings.MYSQL_PASSWORD}@{db_settings.MYSQL_HOST}"
    engine = create_engine(server_url)

    try:
        # Read and execute migration files
        sql_dir = "../sqlfiles"

        # Migration v001: Create database
        with open(os.path.join(sql_dir, "migration-v001.sql"), "r") as f:
            create_db_sql = f.read()

        print("🔧 Creating database...")
        with engine.connect() as conn:
            conn.execute(text(create_db_sql))
            conn.commit()
        print("✅ Database created successfully")

        # Migration v002: Create tables
        with open(os.path.join(sql_dir, "migration-v002.sql"), "r") as f:
            create_tables_sql = f.read()

        print("🔧 Creating tables...")
        with engine.connect() as conn:
            conn.execute(text(create_tables_sql))
            conn.commit()
        print("✅ Tables created successfully")

        print("🎉 Database initialization completed!")

    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    init_database()
