#!/bin/bash

# React Form CI/CD Project Setup Script
echo "🚀 Setting up React Form CI/CD Project..."

# Check if Docker is installed
if ! command -v docker &>/dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &>/dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &>/dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &>/dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please review and update the values if needed."
else
    echo "✅ .env file already exists."
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
pnpm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose build

# Start services
echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 API Docs: http://localhost:8000/docs"
echo "🗄️  Database Admin: http://localhost:8080"
echo ""
echo "👤 Admin credentials:"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Run tests: pnpm test"
echo "   Run E2E tests: pnpm run cypress:run"
echo ""
echo "🔧 For development:"
echo "   Frontend: pnpm run dev"
echo "   Backend: cd backend && uvicorn main:app --reload"
