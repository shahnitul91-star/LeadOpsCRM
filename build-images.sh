#!/bin/bash

set -e

echo "📦 Building Production-Ready Images"
echo "====================================="

echo ""
echo "Building backend image..."
docker build -f backend/Dockerfile -t leadopscrm-backend:latest ./backend

echo ""
echo "Building frontend image..."
docker build -f frontend/Dockerfile -t leadopscrm-frontend:latest ./frontend

echo ""
echo "✅ Images built successfully!"
echo ""
echo "To push to Docker Hub:"
echo "  docker tag leadopscrm-backend:latest your-username/leadopscrm-backend:latest"
echo "  docker tag leadopscrm-frontend:latest your-username/leadopscrm-frontend:latest"
echo "  docker push your-username/leadopscrm-backend:latest"
echo "  docker push your-username/leadopscrm-frontend:latest"
echo ""
echo "To run locally:"
echo "  docker-compose up -d"
