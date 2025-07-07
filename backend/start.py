#!/usr/bin/env python3
"""
Startup script for the User Registration API
Initializes database and starts the FastAPI server
"""

import os
import sys
import subprocess
from pathlib import Path


def main():
    """Main startup function"""

    print("🚀 Starting User Registration API...")

    # Check if we're in the right directory
    if not Path("app.py").exists():
        print(
            "❌ Error: app.py not found. Please run this script from the backend directory.")
        sys.exit(1)

    # Initialize database
    print("🔧 Initializing database...")
    try:
        subprocess.run([sys.executable, "init_db.py"], check=True)
        print("✅ Database initialized successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Database initialization failed: {e}")
        print("⚠️  Continuing anyway...")

    # Start the server
    print("🌐 Starting FastAPI server...")
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn",
            "app:app",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
