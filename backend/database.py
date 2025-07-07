import os
import mysql.connector
from mysql.connector import Error


def get_connection():
    """Get MySQL database connection"""
    return mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )


def create_admin_user():
    """Create admin user if not exists (fallback if not in migration)"""
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check if admin exists
        cursor.execute("SELECT * FROM users WHERE role = 'admin'")
        admin_exists = cursor.fetchone()

        if not admin_exists:
            admin_email = os.getenv("ADMIN_EMAIL")
            admin_password = os.getenv("ADMIN_PASSWORD")

            if admin_email and admin_password:
                from auth import hash_password

                # Hash password
                hashed_password = hash_password(admin_password)

                # Insert admin user with new structure
                sql = """
                    INSERT INTO users (last_name, first_name, email, password, birth_date, city, postal_code, role) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """
                values = ("Goat", "Loïse", admin_email, hashed_password,
                          "1990-01-01", "Admin City", "00000", "admin")
                cursor.execute(sql, values)
                conn.commit()
                print(f"Admin user created with email: {admin_email}")

    except Error as err:
        print(f"Error creating admin user: {err}")
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()
