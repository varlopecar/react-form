# User Registration API Backend

A simplified FastAPI backend for user registration and authentication using SQL migrations.

## Features

- User registration and login
- Role-based authentication (admin/user)
- Admin user management
- CORS support
- MySQL database integration
- SQL migration files

## Quick Start

### Prerequisites

- Python 3.11+
- MySQL database

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp ../env.example ../.env
# Edit .env with your database credentials
```

3. Start the server (automatically initializes database):
```bash
python start.py
```

Or manually:
```bash
# Initialize database
python init_db.py

# Start server
python app.py
```

## API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health check with CORS info
- `GET /cors-debug` - CORS configuration debug
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /users` - Get all users (admin only)
- `DELETE /users/{id}` - Delete user (admin only)
- `GET /me` - Get current user info

## Database Schema

The database uses SQL migration files in `../sqlfiles/`:
- `migration-v001.sql` - Creates the database
- `migration-v002.sql` - Creates the users table

## Environment Variables

- `MYSQL_DATABASE` - Database name (default: user_registration)
- `MYSQL_USER` - Database user
- `MYSQL_PASSWORD` - Database password
- `MYSQL_HOST` - Database host
- `ADMIN_EMAIL` - Admin user email
- `ADMIN_PASSWORD` - Admin user password
- `JWT_SECRET` - JWT secret key
- `CORS_ORIGINS` - Allowed CORS origins

## Project Structure

```
backend/
├── app.py              # Main FastAPI application
├── database.py         # Database configuration
├── models.py           # SQLAlchemy models
├── schemas.py          # Pydantic schemas
├── init_db.py          # Database initialization
├── start.py            # Startup script
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## Docker

```bash
docker build -t user-registration-backend .
docker run -p 8000:8000 user-registration-backend
```
