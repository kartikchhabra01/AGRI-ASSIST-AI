# AGRI ASSIST AI

> An AI-powered crop advisory platform that helps farmers and field supervisors get guidance on crop diseases, pest management, and farming practices.

## Project Overview

AGRI ASSIST AI is a full-stack web application designed to provide instant agricultural guidance using artificial intelligence. Users can ask questions about crop diseases, pest management, nutrient deficiencies, and farming practices through a simple chat interface. The platform leverages Google's Gemini API to generate context-aware recommendations while encouraging users to verify critical advice with agricultural experts.

## Features

- AI-powered crop advisory chatbot with disease diagnosis
- Secure user authentication with JWT tokens
- Query history with AI-generated recommendations
- Profile management (name, farm location, crop type)
- Account settings (password change, account deletion)
- Dashboard analytics and statistics
- Crop health reporting and tracking
- Responsive mobile-first design with dark/light mode
- Full CRUD operations for all data entities

## Tech Stack

### Frontend
- React.js - UI framework
- Tailwind CSS - Styling
- React Router - Client-side routing
- Axios - HTTP client
- Framer Motion - Animations
- Lucide React - Icons
- React Hot Toast - Notifications

### Backend
- Node.js - Runtime environment
- Express.js - Web framework

### Database
- MongoDB Atlas - Cloud database
- Mongoose - ODM for MongoDB

### Authentication
- JWT - Token-based authentication
- bcryptjs - Password hashing

### AI Integration
- Google Gemini API - AI advisory generation

### Deployment
- Vercel - Frontend hosting
- Render - Backend hosting

## Folder Structure

```
AGRI-ASSIST-AI/
├── frontend/                    # React.js client application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # UI component library
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── ConfirmModal.jsx
│   │   │   │   └── index.js
│   │   │   ├── Logo.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/            # React context providers
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AIChat.jsx
│   │   │   ├── ComponentShowcase.jsx
│   │   │   └── AccountSettings.jsx
│   │   ├── services/           # API services
│   │   │   └── api.js
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/                     # Express.js API server
│   ├── config/                 # Configuration files
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Route controllers
│   │   ├── authController.js
│   │   ├── advisoryController.js
│   │   ├── cropController.js
│   │   └── dashboardController.js
│   ├── middleware/             # Express middleware
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/                 # Mongoose models
│   │   ├── User.js
│   │   ├── Query.js
│   │   └── CropHealth.js
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js
│   │   ├── advisoryRoutes.js
│   │   ├── cropRoutes.js
│   │   └── dashboardRoutes.js
│   ├── services/               # External services
│   │   └── aiService.js        # Gemini API integration
│   ├── utils/                  # Utility functions
│   │   └── generateToken.js
│   ├── server.js               # Server entry point
│   ├── package.json
│   └── .env.example            # Environment variables template
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

## Installation Steps

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

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

4. Update the `.env` file with your credentials:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Environment Variables

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Backend server port | Yes |
| JWT_SECRET | Secret key for JWT token generation | Yes |
| GEMINI_API_KEY | Google Gemini API key for AI advisory | Yes |
| CORS_ORIGIN | Frontend URL for CORS configuration | Yes |
| MONGO_URI | MongoDB Atlas connection string | Yes |

## API Routes

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/password` - Change password (protected)
- `DELETE /api/auth/account` - Delete user account (protected)

### Advisory Routes (`/api/advisory`)
- `POST /api/advisory/chat` - Submit a new advisory query (protected)
- `GET /api/advisory/history` - Get query history (protected)
- `GET /api/advisory/history/:id` - Get specific query (protected)
- `GET /api/advisory/search?q=` - Search queries (protected)
- `PUT /api/advisory/:id` - Update a query (protected)
- `DELETE /api/advisory/:id` - Delete a query (protected)
- `DELETE /api/advisory/all` - Delete all queries (protected)

### Crop Routes (`/api/crop`)
- `POST /api/crop/report` - Submit crop health report (protected)
- `GET /api/crop/reports` - Get all crop reports (protected)
- `GET /api/crop/reports/:id` - Get specific report (protected)

### Dashboard Routes (`/api/dashboard`)
- `GET /api/dashboard/stats` - Get overall statistics (protected)
- `GET /api/dashboard/user-stats` - Get user-specific statistics (protected)

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required, min 2 chars),
  email: String (required, unique, valid email),
  password: String (required, hashed),
  location: String (optional),
  farmLocation: String (optional),
  cropType: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Query Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  crop: String (required, min 2 chars),
  issue: String (required, min 5 chars),
  diagnosis: String (optional),
  recommendation: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### CropHealth Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  crop: String (required, min 2 chars),
  disease: String (required, min 2 chars),
  severity: String (enum: Low, Moderate, High),
  affectedArea: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## CRUD Functionality

### User Profile
- **Create**: Register new user via `/api/auth/register`
- **Read**: Get profile via `/api/auth/me`
- **Update**: Update profile via `/api/auth/profile`
- **Delete**: Delete account via `/api/auth/account`

### Advisory Queries
- **Create**: Submit query via `/api/advisory/chat`
- **Read**: View history via `/api/advisory/history`
- **Update**: Edit query via `/api/advisory/:id`
- **Delete**: Remove query via `/api/advisory/:id` or all via `/api/advisory/all`

### Crop Health Reports
- **Create**: Submit report via `/api/crop/report`
- **Read**: View reports via `/api/crop/reports`
- **Update**: Not implemented
- **Delete**: Not implemented

## Week-wise Progress

### Week 1: Project Setup
- Initial GitHub repository
- Basic folder structure
- Project initialization

### Week 2: Frontend Pages
- Created Home, About, Dashboard, Login, Register pages
- Implemented React Router
- Basic navigation setup

### Week 3: UI Components & Styling
- Built component library (Button, Input, Modal, etc.)
- Implemented responsive design
- Added dark/light mode
- Created Figma wireframes
- Tested on mobile, tablet, and laptop

### Week 4: CRUD Functionality
- **Backend**: Added PUT/DELETE endpoints for auth and advisory
- **Frontend**: Created AccountSettings page with CRUD UI
- **Security**: JWT protected routes, password verification, ownership checks
- **Testing**: End-to-end CRUD verification

### Week 5: Database Integration
- Connected MongoDB Atlas
- Created Mongoose models (User, Query, CropHealth)
- Updated all controllers to use MongoDB
- Implemented proper database relationships
- Created architecture documentation
- Prepared Gemini API integration

## Architecture

### System Architecture
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │   Backend       │         │   Database      │
│   (React)       │◄────────►│   (Express)     │◄────────►│   (MongoDB)     │
│                 │  HTTP    │                 │  Mongoose │                 │
│  - UI Components│         │  - Controllers  │         │  - Users        │
│  - API Client   │         │  - Middleware   │         │  - Queries      │
│  - State Mgmt   │         │  - Routes       │         │  - CropHealth   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                      │
                                      ▼
                              ┌─────────────────┐
                              │  Gemini API     │
                              │  (AI Advisory)  │
                              └─────────────────┘
```

### Data Flow
1. User submits query through React frontend
2. Axios sends HTTP request to Express backend
3. Backend authenticates via JWT middleware
4. Controller processes request with Mongoose models
5. Data stored/retrieved from MongoDB Atlas
6. For advisory queries, Gemini API generates recommendations
7. Response sent back to frontend
8. Frontend updates UI with new data

## Screenshots

### CRUD Verification
- Profile update functionality
- Password change with verification
- Account deletion with confirmation
- Advisory query editing and deletion

### Database Integration
- MongoDB Atlas connection
- Data persistence across sessions
- Query history storage
- Crop health reports tracking

### AI Advisory Chat
- Chat interface for crop queries
- AI-generated disease diagnosis
- Context-aware recommendations
- Query history with responses

### Dashboard Analytics
- User activity statistics
- Query and report counts
- Recent activity tracking
- Crop and disease insights

## Future Improvements

- **Enhance Gemini API**: Crop-specific intelligent recommendations with disease diagnosis
- **Multilingual Support**: Add Hindi and other regional language support
- **Weather APIs**: Integrate weather data for context-aware recommendations
- **Image Recognition**: Allow users to upload crop images for disease detection
- **Expert Verification**: Connect with agricultural experts for critical advice verification
- **Mobile App**: Develop native mobile applications (iOS/Android)
- **Offline Mode**: Enable offline functionality with data synchronization
- **Real-time Notifications**: Push notifications for urgent crop alerts
- **Advanced Analytics**: Enhanced analytics for farmers and administrators

## License

This project is developed as part of SIP 2026 (Summer Internship Programme).

---

**Note**: This is an educational project. Always verify agricultural advice with certified experts before implementation.