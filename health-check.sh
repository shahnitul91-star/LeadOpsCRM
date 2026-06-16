#!/bin/bash

echo "📊 LeadOpsCRM Health Check"
echo "============================"

echo ""
echo "🔍 Checking Backend Health..."
curl -s http://localhost:5000/api/health | jq '.' || echo "❌ Backend is not responding"

echo ""
echo "🔍 Checking Docker Containers..."
docker-compose ps

echo ""
echo "🔍 Checking Service Ports..."
echo "Frontend (3000):"
netstat -tulpn 2>/dev/null | grep ':3000' || echo "  Not listening"

echo "Backend (5000):"
netstat -tulpn 2>/dev/null | grep ':5000' || echo "  Not listening"

echo "MongoDB (27017):"
netstat -tulpn 2>/dev/null | grep ':27017' || echo "  Not listening"

echo "Redis (6379):"
netstat -tulpn 2>/dev/null | grep ':6379' || echo "  Not listening"

echo ""
echo "📋 View logs:"
echo "  Backend logs: docker-compose logs backend"
echo "  Frontend logs: docker-compose logs frontend"
echo "  MongoDB logs: docker-compose logs mongodb"
echo "  Redis logs: docker-compose logs redis"
