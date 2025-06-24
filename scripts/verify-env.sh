#!/bin/bash

echo "🔍 Verifying environment configuration..."

# Function to check environment variables
check_env() {
    local env_file=$1
    local env_name=$2

    echo ""
    echo "📋 $env_name Environment Variables:"
    echo "=================================="

    if [ -f "$env_file" ]; then
        echo "✅ $env_file exists"

        # Check key variables
        echo ""
        echo "🔑 Key Variables:"

        # Database variables
        if grep -q "^DATABASE_URL=" "$env_file"; then
            echo "✅ DATABASE_URL: $(grep "^DATABASE_URL=" "$env_file" | cut -d'=' -f2- | cut -c1-50)..."
        else
            echo "❌ DATABASE_URL: Not set"
        fi

        # Frontend API URL
        if grep -q "^VITE_API_URL=" "$env_file"; then
            echo "✅ VITE_API_URL: $(grep "^VITE_API_URL=" "$env_file" | cut -d'=' -f2-)"
        else
            echo "❌ VITE_API_URL: Not set"
        fi

        # Admin credentials
        if grep -q "^ADMIN_EMAIL=" "$env_file"; then
            echo "✅ ADMIN_EMAIL: $(grep "^ADMIN_EMAIL=" "$env_file" | cut -d'=' -f2-)"
        else
            echo "❌ ADMIN_EMAIL: Not set"
        fi

        # CORS origins
        if grep -q "^CORS_ORIGINS=" "$env_file"; then
            echo "✅ CORS_ORIGINS: $(grep "^CORS_ORIGINS=" "$env_file" | cut -d'=' -f2-)"
        else
            echo "❌ CORS_ORIGINS: Not set"
        fi

    else
        echo "❌ $env_file does not exist"
    fi
}

# Check both environment files
check_env ".env" "Local Development"
check_env ".env.production" "Production"

echo ""
echo "🌐 Environment Detection:"
echo "========================"

# Check current environment
if [ "$NODE_ENV" = "production" ]; then
    echo "✅ NODE_ENV: production (will use .env.production)"
elif [ "$VERCEL_ENV" ]; then
    echo "✅ VERCEL_ENV: $VERCEL_ENV (will use .env.production)"
elif [ "$RAILWAY_ENVIRONMENT" ]; then
    echo "✅ RAILWAY_ENVIRONMENT: $RAILWAY_ENVIRONMENT (will use .env.production)"
else
    echo "ℹ️  NODE_ENV: development (will use .env)"
fi

echo ""
echo "🚀 Deployment Instructions:"
echo "=========================="
echo "1. For Vercel/Railway deployment:"
echo "   - Set NODE_ENV=production in your deployment environment"
echo "   - Or the backend will automatically detect Vercel/Railway environment"
echo ""
echo "2. For local testing:"
echo "   - Use 'npm run dev' for frontend (uses .env)"
echo "   - Use 'cd backend && python main.py' for backend (uses .env)"
echo ""
echo "3. For production testing:"
echo "   - Set NODE_ENV=production before running"
echo "   - Or deploy to Vercel/Railway for automatic detection"
