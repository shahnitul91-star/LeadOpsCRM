# LeadOpsCRM Deployment Guide

## Quick Start (Development)

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js v18+ (for local development)

### Local Deployment with Docker Compose

```bash
# 1. Clone the repository
git clone https://github.com/shahnitul91-star/LeadOpsCRM.git
cd LeadOpsCRM

# 2. Checkout the dev/core-modules branch
git checkout dev/core-modules

# 3. Create .env file
cp .env.example .env

# 4. Update .env with your configuration
vi .env  # or use your preferred editor

# 5. Make deploy script executable
chmod +x deploy.sh health-check.sh cleanup.sh

# 6. Run deployment
./deploy.sh
```

## Configuration (.env file)

```bash
# Database
MONGO_USER=admin
MONGO_PASSWORD=secure_password_here

# JWT
JWT_SECRET=your_very_secure_jwt_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://your-domain.com/api/auth/google/callback

# URLs
FRONTEND_URL=http://your-domain.com
API_URL=http://your-domain.com/api

# Environment
NODE_ENV=production
```

## Accessing the Application

### Development
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **MongoDB**: localhost:27017 (user: admin, password: password)
- **Redis**: localhost:6379

### Production
- **Frontend**: http://your-domain.com
- **Backend API**: http://your-domain.com/api
- **Health Check**: http://your-domain.com/api/health

## Service Management

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
docker-compose logs -f redis
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild and Restart
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Health Checks

```bash
# Run health check script
./health-check.sh

# Or manually check
curl http://localhost:5000/api/health
```

## Database Initialization

The database will be automatically initialized on first run. Seeds include:
- 6 default roles
- 11 departments
- Default admin user (if configured)

To manually initialize:
```bash
docker-compose exec backend npm run seed
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (dev)
   - `http://your-domain.com/api/auth/google/callback` (prod)
6. Copy Client ID and Client Secret to `.env`

## Production Deployment

### Using AWS EC2

1. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t3.medium or larger
   - Security Group: Allow ports 80, 443, 3000, 5000, 27017, 6379

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Docker & Docker Compose**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   sudo usermod -aG docker ubuntu
   ```

4. **Clone Repository**
   ```bash
   git clone https://github.com/shahnitul91-star/LeadOpsCRM.git
   cd LeadOpsCRM
   git checkout dev/core-modules
   ```

5. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your values
   ```

6. **Deploy**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Using Docker Hub

1. **Build Images**
   ```bash
   docker build -t your-username/leadopscrm-backend ./backend
   docker build -t your-username/leadopscrm-frontend ./frontend
   docker push your-username/leadopscrm-backend
   docker push your-username/leadopscrm-frontend
   ```

2. **Update docker-compose.yml**
   ```yaml
   backend:
     image: your-username/leadopscrm-backend:latest
   frontend:
     image: your-username/leadopscrm-frontend:latest
   ```

3. **Deploy**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Using Kubernetes

See `/docs/KUBERNETES_DEPLOYMENT.md` for Kubernetes deployment instructions.

## SSL/HTTPS Setup (Production)

### Using Let's Encrypt with Nginx

1. **Install Nginx**
   ```bash
   sudo apt-get update
   sudo apt-get install -y nginx
   ```

2. **Configure Nginx as Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /api {
           proxy_pass http://localhost:5000/api;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **Install Certbot**
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Monitoring & Logging

### Container Logs
```bash
docker-compose logs --tail=100 -f backend
```

### Database Backup
```bash
docker-compose exec mongodb mongodump --out /backup
```

### Database Restore
```bash
docker-compose exec mongodb mongorestore /backup
```

## Troubleshooting

### Containers Won't Start
```bash
# Check logs
docker-compose logs

# Remove old containers
docker-compose down -v

# Rebuild
docker-compose build --no-cache

# Start again
docker-compose up -d
```

### Port Already in Use
```bash
# Find what's using the port
sudo lsof -i :3000  # or :5000, :27017, etc.

# Kill the process
sudo kill -9 <PID>

# Or change the port in docker-compose.yml
```

### Memory Issues
```bash
# Increase Docker memory in docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
```

### Database Connection Issues
```bash
# Check MongoDB is running
docker-compose logs mongodb

# Connect to MongoDB directly
docker-compose exec mongodb mongosh

# Check Redis
docker-compose exec redis redis-cli
```

## Cleanup

```bash
# Stop containers
docker-compose down

# Remove volumes (be careful - deletes data)
docker-compose down -v

# Remove images
docker image rm leadopscrm-backend leadopscrm-frontend

# Or use cleanup script
./cleanup.sh
```

## Next Steps

1. ✅ Deploy the application
2. ✅ Access at http://localhost:3000
3. ✅ Configure Google OAuth
4. ✅ Create admin users
5. ✅ Set up Google Sheets sync
6. ✅ Configure departments & dispositions
7. ✅ Start importing leads
8. ✅ Set up monitoring & backups

## Support & Documentation

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Setup Guide](./docs/SETUP_GUIDE.md)
- [GitHub Issues](https://github.com/shahnitul91-star/LeadOpsCRM/issues)

## Security Considerations

- ✅ Change default MongoDB credentials in production
- ✅ Use strong JWT secret
- ✅ Enable HTTPS/SSL
- ✅ Use environment variables for sensitive data
- ✅ Regular database backups
- ✅ Monitor access logs
- ✅ Keep Docker images updated

## License

MIT License - See LICENSE file for details
