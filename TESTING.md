# Frontend-Backend Integration Testing Guide

This guide explains how to test the complete frontend-backend integration of the React Form application.

## Prerequisites

1. **Backend running**: Make sure your FastAPI backend is running on `http://localhost:8000`
2. **Database running**: Ensure MySQL database is running and accessible
3. **Frontend dependencies**: Install frontend dependencies with `pnpm install`

## Quick Test Script

The easiest way to test the backend API integration is using the provided Node.js script:

```bash
# Install dependencies if not already done
pnpm install

# Run the integration test script
pnpm run test:integration
```

This script will test:

- ✅ Backend health check
- ✅ Admin login
- ✅ User registration
- ✅ User login
- ✅ Admin user management (view users, delete users)
- ✅ API error handling

## Manual Testing Steps

### 1. Start the Backend

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start the Frontend

```bash
# In a new terminal
pnpm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Test User Registration

1. Open `http://localhost:3000` in your browser
2. Fill out the registration form:
   - **First Name**: John
   - **Last Name**: Doe
   - **Email**: john.doe@example.com
   - **Birth Date**: 1990-01-01
   - **City**: Paris
   - **Postal Code**: 75001
3. Click "S'inscrire"
4. You should see a success message: "Inscription réussie !"

### 4. Test Admin Login

1. Click "Connexion Admin" link
2. Use admin credentials:
   - **Email**: admin@example.com
   - **Password**: admin123
3. Click "Se connecter"
4. You should be redirected to the admin panel

### 5. Test User Management

In the admin panel, you should see:

1. **Users Table** with columns:

   - Nom (Name)
   - Email
   - Ville (City)
   - Code Postal (Postal Code)
   - Date de naissance (Birth Date)
   - Admin (Admin status)
   - Actions

2. **User List** showing:

   - Admin user (admin@example.com) with "Oui" (Yes) for admin status
   - Any registered users with "Non" (No) for admin status

3. **Delete Functionality**:
   - Non-admin users have a "Supprimer" (Delete) button
   - Admin users cannot be deleted (no delete button)
   - Clicking delete shows a confirmation dialog

### 6. Test User Login

1. Register a new user through the registration form
2. Logout from admin panel
3. Click "Connexion Admin"
4. Login with the newly registered user's email and password "password123"
5. You should be able to access the admin panel and see the users list

## Cypress E2E Testing

For automated end-to-end testing:

```bash
# Install Cypress dependencies
pnpm install

# Run Cypress tests
pnpm run cypress:run
```

Or open Cypress UI:

```bash
pnpm run cypress:open
```

The Cypress tests cover:

- ✅ User registration with validation
- ✅ Duplicate email prevention
- ✅ Admin and user login
- ✅ Admin panel functionality
- ✅ User management (view, delete)
- ✅ Navigation between views
- ✅ API integration testing

## API Endpoints Tested

### Backend Health

- `GET /` - Returns API status and version

### Authentication

- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user info

### User Management (Admin Only)

- `GET /users` - List all users
- `DELETE /users/{user_id}` - Delete a user

## Expected Test Results

### Successful Registration

```json
{
  "id": 2,
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "birth_date": "1990-01-01",
  "city": "Paris",
  "postal_code": "75001",
  "is_admin": false
}
```

### Successful Login

```json
{
  "access_token": "john.doe@example.com",
  "token_type": "bearer"
}
```

### Users List

```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "is_admin": true
  },
  {
    "id": 2,
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_admin": false
  }
]
```

## Troubleshooting

### Backend Not Starting

- Check if MySQL is running
- Verify database connection string in `.env`
- Check if all Python dependencies are installed

### Frontend Not Connecting to Backend

- Verify `VITE_API_URL` environment variable is set to `http://localhost:8000`
- Check if backend is running on port 8000
- Check browser console for CORS errors

### Database Issues

- Ensure MySQL is running
- Check database credentials
- Verify database schema is created

### Test Failures

- Check if both frontend and backend are running
- Verify admin credentials (admin@example.com / admin123)
- Check browser console for JavaScript errors
- Review network tab for failed API calls

## CI/CD Testing

The GitHub Actions workflow automatically runs:

1. **Unit tests** (Vitest for frontend, pytest for backend)
2. **E2E tests** (Cypress with full frontend-backend integration)
3. **Integration tests** (API testing)

All tests must pass before deployment to production.
