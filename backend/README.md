# AGRI ASSIST AI Backend

Backend API for AGRI ASSIST AI - AI-powered Crop Advisory Platform.

## Tech Stack

- Node.js
- Express.js
- In-memory arrays (Week 4) - Will migrate to MongoDB Atlas in Week 5
- JWT Authentication
- bcryptjs for password hashing
- Placeholder AI service (Week 4) - Will integrate Gemini API in Week 5

## Features

- User registration and authentication
- AI-powered crop advisory queries
- Crop health reporting
- Dashboard statistics
- Query history tracking
- Search functionality

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
GEMINI_API_KEY=your_gemini_api_key_here
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Advisory

- `POST /api/advisory/chat` - Submit crop advisory query (protected)
- `GET /api/advisory/history` - Get query history (protected)
- `GET /api/advisory/history/:id` - Get specific query (protected)
- `GET /api/advisory/search?q=` - Search queries (protected)

### Crop Health

- `POST /api/crop/report` - Submit crop health report (protected)
- `GET /api/crop/reports` - Get crop reports (protected)
- `GET /api/crop/reports/:id` - Get specific report (protected)

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics (protected)
- `GET /api/dashboard/user-stats` - Get user-specific statistics (protected)

## Testing with Postman

1. Import the Postman collection: `AGRI_ASSIST_API.postman_collection.json`
2. Set up environment variable `token` after logging in
3. Test all endpoints

## API Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Week 4 Notes

- Uses in-memory arrays for data storage
- Placeholder AI service with predefined responses
- Ready for MongoDB migration in Week 5
- Ready for Gemini API integration in Week 5

## Week 5 Migration Plan

1. Replace in-memory arrays with MongoDB Atlas
2. Update config/db.js to use Mongoose
3. Implement real Gemini API integration in services/aiService.js
4. Add proper database indexing
5. Implement data validation schemas

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── advisoryController.js
│   ├── cropController.js
│   └── dashboardController.js
├── middleware/
│   ├── authMiddleware.js  # JWT authentication
│   └── errorMiddleware.js # Error handling
├── models/
│   ├── User.js            # User model
│   ├── Query.js           # Query model
│   └── CropHealth.js      # Crop health model
├── routes/
│   ├── authRoutes.js
│   ├── advisoryRoutes.js
│   ├── cropRoutes.js
│   └── dashboardRoutes.js
├── services/
│   └── aiService.js       # AI service for crop advisory
├── utils/
│   └── generateToken.js   # JWT token generation
├── .env.example           # Environment variables template
├── server.js              # Express server entry point
├── package.json           # Dependencies
└── README.md              # This file
```

## Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens expire in 7 days
- All protected routes require valid JWT token
- Environment variables for sensitive data

## Author

Kartik Chhabra
