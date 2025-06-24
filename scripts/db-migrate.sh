#!/bin/bash

# Database migration script
# This script runs migrations on the backend container

set -e

echo "Running database migrations..."

# Run migrations in the backend container
docker-compose exec backend alembic upgrade head

echo "Migrations completed successfully!"
