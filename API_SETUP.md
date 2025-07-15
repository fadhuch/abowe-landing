# REST API Setup Guide

This project now uses a proper REST API backend that connects to MongoDB Atlas. This is the recommended and secure approach for production applications.

## 🏗️ Architecture

```
Frontend (React) → REST API (Express.js) → MongoDB Atlas
```

- **Frontend**: React app running on Vite (port 5173)
- **Backend**: Express.js API server (port 5001)
- **Database**: MongoDB Atlas cloud database

## 🚀 Quick Start

### 1. Start the API Server
```bash
cd api
npm install
npm run dev
```

### 2. Start the Frontend (in a new terminal)
```bash
npm run dev
```

### 3. Or start both simultaneously
```bash
npm run start  # Starts both API and frontend
```

## 📋 API Endpoints

### Health Check
```http
GET /api/health
```
Response:
```json
{
  "status": "OK",
  "timestamp": "2025-07-15T16:59:25.344Z",
  "database": "Connected"
}
```

### Add to Waitlist
```http
POST /api/waitlist
Content-Type: application/json

{
  "email": "john@example.com"
}
```

Success Response:
```json
{
  "success": true,
  "message": "Successfully added to waitlist",
  "data": {
    "id": "687688f663e244ff26fd2609",
    "email": "john@example.com"
  }
}
```

Error Response:
```json
{
  "success": false,
  "message": "This email is already on our waitlist!"
}
```

### Check Email Exists
```http
POST /api/waitlist/check
Content-Type: application/json

{
  "email": "john@example.com"
}
```

Response:
```json
{
  "success": true,
  "exists": true
}
```

### Get Waitlist Statistics
```http
GET /api/waitlist/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "totalCount": 42,
    "timestamp": "2025-07-15T16:59:48.231Z"
  }
}
```

### Admin Endpoints

#### Get All Waitlist Entries
```http
GET /api/admin/waitlist?page=1&limit=50&sortBy=createdAt&sortOrder=desc
```

Response:
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "_id": "687688f663e244ff26fd2609",
        "email": "john@example.com",
        "createdAt": "2025-07-15T16:59:34.985Z",
        "source": "landing-page",
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0..."
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalCount": 1,
      "hasNextPage": false,
      "hasPrevPage": false,
      "limit": 50
    }
  }
}
```

#### Export Waitlist as CSV
```http
GET /api/admin/waitlist/export
```

Returns CSV file download with headers:
`Email,Created At,Source,IP Address,User Agent`

#### Delete Waitlist Entry
```http
DELETE /api/admin/waitlist/:id
```

Response:
```json
{
  "success": true,
  "message": "Entry deleted successfully"
}
```

## 🔧 Configuration

### API Server Environment Variables (`api/.env`)
```env
PORT=5001
NODE_ENV=development
```

### Frontend Environment Variables (`.env.local`)
```env
VITE_API_URL=http://localhost:5001/api
```

## 🛡️ Security Features

- ✅ **Input Validation**: Server-side validation for all inputs
- ✅ **CORS Protection**: Configured for specific origins
- ✅ **Duplicate Prevention**: Unique email constraint
- ✅ **Rate Limiting**: Can be added for production
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **Data Sanitization**: Email normalization, name trimming

## 📊 Data Model

Waitlist entries are stored with:
```javascript
{
  _id: ObjectId,
  email: String,
  createdAt: Date,
  source: "landing-page",
  ipAddress: String,
  userAgent: String
}
```

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:5001/api/health

# Add to waitlist
curl -X POST http://localhost:5001/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'

# Get stats
curl http://localhost:5001/api/waitlist/stats
```

### Frontend Testing
1. Open http://localhost:5173
2. Check developer tools for API connection status
3. Submit the waitlist form
4. Verify success/error messages

## 🚀 Production Deployment

### API Server
- Deploy to platforms like Heroku, Railway, or DigitalOcean
- Set production environment variables
- Configure CORS for your domain
- Enable rate limiting and security headers

### Frontend
- Build with `npm run build`
- Deploy to Netlify, Vercel, or any static hosting
- Update `VITE_API_URL` to your production API URL

### MongoDB Atlas
- Whitelist your production server IP
- Use strong connection string credentials
- Enable Atlas monitoring and alerts

## 📁 Project Structure

```
/
├── src/                    # Frontend React app
│   ├── services/
│   │   └── api.js         # API service client
│   ├── components/
│   ├── App.jsx            # Main component
│   └── App.css            # Styles
├── api/                   # Backend API server
│   ├── server.js          # Express server
│   ├── package.json       # API dependencies
│   └── .env              # API environment variables
├── package.json           # Frontend dependencies & scripts
└── .env.local            # Frontend environment variables
```

## 🔍 Development Tools

In development mode, a status panel appears in the bottom-right corner showing:
- API health status
- Total waitlist count
- Quick links to API endpoints

## 📝 Notes

- The old `server/index.cjs` file can be safely deleted
- MongoDB service files are deprecated in favor of the REST API
- Database indexes are automatically created for email uniqueness
- All API requests include comprehensive logging for debugging
