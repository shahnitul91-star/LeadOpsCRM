# Update Existing Deployment

If you already have a running deployment and want to update it:

## 1. Pull Latest Changes

```bash
git pull origin dev/core-modules
```

## 2. Stop Current Services

```bash
docker-compose down
```

## 3. Rebuild Images

```bash
docker-compose build --no-cache backend frontend
```

## 4. Start Services

```bash
docker-compose up -d
```

## 5. Verify Deployment

```bash
./health-check.sh
```

## Rolling Update (Zero Downtime)

```bash
# Update backend only (keep frontend running)
docker-compose up -d --no-deps --build backend

# Update frontend only (keep backend running)
docker-compose up -d --no-deps --build frontend
```

## Database Migrations

If there are database schema changes:

```bash
# Backup database
docker-compose exec mongodb mongodump --out /backup/$(date +%Y%m%d)

# Run migrations
docker-compose exec backend npm run migrate

# Verify
curl http://localhost:5000/api/health
```
