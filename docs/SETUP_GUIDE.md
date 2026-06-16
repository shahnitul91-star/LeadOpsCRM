# LeadOpsCRM Setup Guide

## Prerequisites

- Node.js v18+
- Docker & Docker Compose
- MongoDB
- Redis
- Google OAuth2 credentials

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shahnitul91-star/LeadOpsCRM.git
cd LeadOpsCRM
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `GOOGLE_CLIENT_ID`: Google OAuth2 Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth2 Client Secret
- `FRONTEND_URL`: Frontend application URL

```bash
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd ../frontend
cp .env.example .env
```

Edit `.env` with your configuration:
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_GOOGLE_CLIENT_ID`: Google Client ID for frontend

```bash
npm install
npm start
```

## Docker Setup

### Using Docker Compose

```bash
cp .env.example .env
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Redis on port 6379
- Backend on port 5000
- Frontend on port 3000

### Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## Database Initialization

The database seeds will be initialized automatically on first run. To manually seed:

```bash
node backend/src/utils/seedDatabase.js
```

This creates:
- 6 default roles (Super Admin, Admin, Manager, Team Leader, ATL, Agent)
- 11 departments (Higher Management, Campaign, NLPC & HR, and sub-departments)

## Google Sheets Integration

1. Create a Google Service Account with Sheets API enabled
2. Download the JSON key file
3. Add the key file path to your `.env` file: `GOOGLE_KEY_FILE=path/to/key.json`
4. Share your Google Sheet with the service account email
5. Add the Sheet ID to the Department configuration

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/leadopscrm
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
REDIS_HOST=localhost
REDIS_PORT=6379
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## API Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

### Google OAuth Error

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check callback URL matches in Google Console
- Ensure user credentials are valid

### Port Already in Use

- Change the `PORT` in `.env`
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

## Development

### Code Structure

```
/backend
  /src
    /models       - Mongoose schemas
    /controllers  - Route handlers
    /routes       - API routes
    /middleware   - Auth, validation middleware
    /services     - Business logic
    /utils        - Helper functions
    /config       - Configuration files
  /tests          - Test files

/frontend
  /src
    /components   - React components
    /pages        - Page components
    /services     - API services
    /context      - Context API
    /hooks        - Custom hooks
    /utils        - Utility functions
```

### Running in Development Mode

Backend with hot-reload:
```bash
cd backend
npm run dev
```

Frontend with hot-reload:
```bash
cd frontend
npm start
```

## Production Deployment

### Building for Production

```bash
cd frontend
npm run build
```

### Docker Production Build

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Next Steps

1. Review the API documentation in `/docs/API_DOCUMENTATION.md`
2. Configure your Google Sheets for data sync
3. Create users and assign roles through the Admin Panel
4. Configure departments and dispositions
5. Start importing leads

## Support

For issues or questions, please open a GitHub issue or contact the development team.
