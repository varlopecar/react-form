# Database Setup

This directory contains database-related files and documentation.

## Migration-based Setup

Instead of using init scripts, this project now uses **Alembic migrations** for database schema management. This approach is more reliable and follows best practices.

### How it works:

1. **Migrations**: Database schema changes are managed through Alembic migrations in `backend/alembic/`
2. **Automatic Setup**: The backend automatically runs migrations and creates the admin user on startup
3. **Environment Variables**: Admin user credentials are configured via environment variables

### Environment Variables:

- `ADMIN_EMAIL`: Admin user email (default: admin@example.com)
- `ADMIN_PASSWORD`: Admin user password (default: admin123)

### Manual Migration Commands:

If you need to run migrations manually:

```bash
# Run migrations
./scripts/db-migrate.sh

# Or directly in the container
docker-compose exec backend alembic upgrade head

# Create a new migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Check migration status
docker-compose exec backend alembic current
```

### Benefits of this approach:

- ✅ **Reliable**: Works consistently across container recreations
- ✅ **Versioned**: Database schema changes are tracked and versioned
- ✅ **Rollback**: Can rollback schema changes if needed
- ✅ **Environment-aware**: Uses proper environment variables
- ✅ **Best practice**: Follows industry standards for database management
