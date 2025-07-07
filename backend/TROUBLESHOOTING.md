# API Troubleshooting Guide

## Common Issues and Solutions

### 1. 500 Internal Server Errors

**Symptoms:**
- Registration and login endpoints return 500 errors
- Long response times (15+ seconds)
- Database connection failures

**Causes:**
- Database connection issues
- Missing environment variables
- Database not accessible from Vercel

**Solutions:**

#### Check Environment Variables
Ensure these are set in your Vercel deployment:
```bash
MYSQL_DATABASE=your_database_name
MYSQL_USER=your_database_user
MYSQL_PASSWORD=your_database_password
MYSQL_HOST=your_database_host
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourdomain.com
```

#### Test Database Connection
Use the `/health` endpoint to check database connectivity:
```bash
curl https://your-api.vercel.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "healthy",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Database Host Issues
- If using a local database, it won't be accessible from Vercel
- Use a cloud database service (PlanetScale, AWS RDS, etc.)
- Ensure the database allows connections from Vercel's IP ranges

### 2. CORS Errors

**Symptoms:**
- Browser shows CORS errors
- OPTIONS requests work but POST requests fail
- Frontend can't connect to API

**Solutions:**

#### Check CORS Configuration
The API now allows all origins (`*`) for debugging. In production, specify exact origins:

```python
# In app.py, replace "*" with your actual domains
allow_origins=[
    "https://yourdomain.com",
    "http://localhost:3000",
    # Remove "*" in production
]
```

#### Test CORS
```bash
# Test OPTIONS request
curl -X OPTIONS https://your-api.vercel.app/register \
  -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"

# Test actual POST request
curl -X POST https://your-api.vercel.app/register \
  -H "Content-Type: application/json" \
  -H "Origin: https://yourdomain.com" \
  -d '{"last_name":"Test","first_name":"User","email":"test@example.com","birth_date":"1990-01-01","city":"Test City","postal_code":"12345","password":"password123"}'
```

### 3. Database Connection Timeouts

**Symptoms:**
- Requests take 15+ seconds
- Database connection errors in logs

**Solutions:**

#### Connection Pooling
The current implementation creates new connections for each request. For production, consider:
- Using connection pooling
- Implementing connection retry logic
- Using a managed database service

#### Timeout Configuration
Current timeouts:
- Connect timeout: 10 seconds
- Read timeout: 30 seconds
- Write timeout: 30 seconds

### 4. JWT Token Issues

**Symptoms:**
- Authentication failures
- Token expiration errors

**Solutions:**

#### Check JWT Secret
Ensure `JWT_SECRET` is set and consistent across deployments.

#### Token Expiration
Default token expiration is 24 hours. Adjust in the code if needed.

### 5. Password Hashing Issues

**Symptoms:**
- Login failures with correct credentials
- Password verification errors

**Solutions:**

#### Check bcrypt Installation
Ensure bcrypt is properly installed:
```bash
pip install bcrypt
```

#### Password Length
Minimum password length is 6 characters, maximum is 100.

## Testing the API

### 1. Health Check
```bash
curl https://your-api.vercel.app/health
```

### 2. Register User
```bash
curl -X POST https://your-api.vercel.app/register \
  -H "Content-Type: application/json" \
  -d '{
    "last_name": "Doe",
    "first_name": "John",
    "email": "john.doe@example.com",
    "birth_date": "1990-01-01",
    "city": "New York",
    "postal_code": "10001",
    "password": "password123"
  }'
```

### 3. Login User
```bash
curl -X POST https://your-api.vercel.app/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### 4. Get Users (Admin Only)
```bash
curl -X GET https://your-api.vercel.app/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Logs and Debugging

### Enable Debug Logging
Set environment variable:
```bash
LOG_LEVEL=debug
```

### Check Vercel Logs
- Go to your Vercel dashboard
- Select your project
- Go to Functions tab
- Check the logs for errors

### Common Log Messages
- `"Database connection established successfully"` - Good
- `"Failed to establish database connection"` - Database issue
- `"User registered successfully"` - Registration working
- `"User logged in successfully"` - Login working

## Production Checklist

- [ ] Environment variables configured
- [ ] Database accessible from Vercel
- [ ] CORS origins properly set
- [ ] JWT secret configured
- [ ] Admin user created
- [ ] Health check passing
- [ ] All endpoints tested
- [ ] Error handling working
- [ ] Logging configured
- [ ] Security headers set

## Emergency Fixes

### If API is Completely Down
1. Check Vercel deployment status
2. Verify environment variables
3. Test database connectivity
4. Check function logs
5. Redeploy if necessary

### If Database is Unreachable
1. Check database service status
2. Verify connection credentials
3. Check network/firewall settings
4. Consider switching to a different database provider 