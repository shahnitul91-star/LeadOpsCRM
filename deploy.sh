#!/bin/bash

set -e

echo "🚀 LeadOpsCRM Deployment Script"
echo "================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with required environment variables."
    echo "Copying from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration values"
    exit 1
fi

echo "✅ .env file found"

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker is installed"

# Check Docker Compose installation
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker Compose is installed"

# Pull latest images
echo ""
echo "📥 Pulling latest images..."
docker-compose pull

# Stop existing containers
echo ""
echo "⛔ Stopping existing containers..."
docker-compose down

# Build images
echo ""
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

# Start services
echo ""
echo "🚀 Starting services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check if services are running
echo ""
echo "✅ Checking service status..."

if docker-compose ps | grep -q "Exit"; then
    echo "❌ Some services failed to start. Checking logs..."
    docker-compose logs
    exit 1
fi

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "📊 Service URLs:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:5000/api"
echo "  - Health Check: http://localhost:5000/api/health"
echo ""
echo "📝 View logs:"
echo "  docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "  docker-compose down"
echo ""
