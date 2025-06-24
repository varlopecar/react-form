#!/bin/bash

echo "🔧 Fixing production environment configuration..."

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found!"
    exit 1
fi

# Create a backup
cp .env.production .env.production.backup
echo "✅ Created backup: .env.production.backup"

# Uncomment DATABASE_URL
sed -i '' 's/# DATABASE_URL=/DATABASE_URL=/' .env.production

# Ensure VITE_API_URL is set correctly
sed -i '' 's|VITE_API_URL=.*|VITE_API_URL=https://backend-44yunag51-varlopecars-projects.vercel.app|' .env.production

echo "✅ Updated .env.production:"
echo "   - Uncommented DATABASE_URL"
echo "   - Ensured VITE_API_URL is set to production backend"
echo ""
echo "📋 Current production settings:"
grep -E "^(DATABASE_URL|VITE_API_URL|ADMIN_EMAIL|CORS_ORIGINS)=" .env.production

echo ""
echo "🚀 Next steps:"
echo "1. Deploy your backend with the updated .env.production"
echo "2. Ensure your frontend deployment uses the correct environment variables"
echo "3. Test the connection to your production database"
