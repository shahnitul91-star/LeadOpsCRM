#!/bin/bash

set -e

echo "🧹 Cleanup Script for LeadOpsCRM"
echo "================================"

echo ""
echo "This script will:"
echo "  1. Stop all running containers"
echo "  2. Remove containers and networks"
echo "  3. Remove dangling images and volumes (optional)"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Stopping containers..."
    docker-compose down
    
    read -p "Remove volumes? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Removing volumes..."
        docker-compose down -v
    fi
    
    read -p "Remove images? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Removing images..."
        docker rmi leadopscrm-backend leadopscrm-frontend
    fi
    
    echo "✅ Cleanup complete!"
else
    echo "❌ Cleanup cancelled"
    exit 1
fi
