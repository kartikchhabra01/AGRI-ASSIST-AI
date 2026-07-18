# AGRI ASSIST AI

> An AI-powered crop advisory platform that helps farmers and field supervisors get guidance on crop diseases, pest management, and farming practices.

## Project Overview

AGRI ASSIST AI is a full-stack web application designed to provide instant agricultural guidance using artificial intelligence. Users can ask questions about crop diseases, pest management, nutrient deficiencies, and farming practices through a simple chat interface. The platform leverages Google's Gemini API to generate context-aware recommendations while encouraging users to verify critical advice with agricultural experts.

## Features

- **Modern AI Chat Interface**: ChatGPT-like conversational experience with natural language understanding
- **Conversation History**: Sidebar with previous conversations, create new chats, delete conversations
- **Multi-language Support**: English, Hindi, Punjabi, Bengali, Tamil with automatic language detection
- **Voice Input**: Browser-based speech recognition for hands-free messaging
- **Voice Output**: Text-to-speech for listening to AI responses
- **Image Analysis**: Upload crop images for AI-powered disease diagnosis using Gemini Vision
- **Context-Aware Responses**: AI maintains conversation context for follow-up questions
- **Suggested Prompts**: Quick action chips for common agricultural queries
- **Markdown Rendering**: Formatted AI responses with code blocks and structured text
- **Secure Authentication**: JWT tokens, Google OAuth 2.0, bcrypt password hashing
- **User Profile Management**: Update profile, change password, delete account
- **Dashboard Analytics**: User statistics and activity tracking
- **Crop Health Reporting**: Track and manage crop health reports
- **Responsive Design**: Mobile-first with dark/light mode support

## Tech Stack

### Frontend
- React.js - UI framework
- Tailwind CSS - Styling
- React Router - Client-side routing
- Axios - HTTP client
- Framer Motion - Animations
- Lucide React - Icons
- React Hot Toast - Notifications
- React Markdown - Markdown rendering for AI responses
- remark-gfm - GitHub Flavored Markdown support

### Backend
- Node.js - Runtime environment
- Express.js - Web framework

### Database
- MongoDB Atlas - Cloud database
- Mongoose - ODM for MongoDB

### Authentication
- JWT - Token-based authentication
- bcryptjs - Password hashing
- Passport.js - Authentication middleware
- Google OAuth 2.0 - Social login integration

### AI Integration
- Google Gemini API (gemini-1.5-flash) - AI advisory generation with conversation context
- @google/generative-ai - Official Gemini SDK for Node.js
- Gemini Vision - Image analysis for crop disease detection
- Browser Speech Recognition API - Voice input
- Browser Speech Synthesis API - Voice output

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
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── ConfirmModal.jsx
│   │   │   │   └── index.js
│   │   │   ├── Logo.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/            # React context providers
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AIChat.jsx
│   │   │   ├── AccountSettings.jsx
│   │   │   └── AuthCallback.jsx
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
│   │   ├── db.js               # MongoDB connection
│   │   └── passport.js         # Passport OAuth configuration
│   ├── controllers/            # Route controllers
│   │   ├── authController.js
│   │   ├── aiController.js
│   │   ├── advisoryController.js
│   │   ├── cropController.js
│   │   └── dashboardController.js
│   ├── middleware/             # Express middleware
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── validator.js        # Input validation
│   │   └── rateLimiter.js      # Rate limiting
│   ├── models/                 # Mongoose models
│   │   ├── User.js
│   │   ├── Chat.js
│   │   ├── Query.js
│   │   └── CropHealth.js
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js
│   │   ├── aiRoutes.js
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
| MONGO_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT token generation | Yes |
| GEMINI_API_KEY | Google Gemini API key for AI advisory | Yes |
| CORS_ORIGIN | Frontend URL for CORS configuration | Yes |
| GOOGLE_CLIENT_ID | Google OAuth client ID | Optional |
| GOOGLE_CLIENT_SECRET | Google OAuth client secret | Optional |
| GOOGLE_CALLBACK_URL | Google OAuth callback URL | Optional |

### Google OAuth Setup (Optional)

To enable Google OAuth login:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to APIs & Services → Credentials
4. Create OAuth 2.0 credentials → Web application
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file
7. Set `GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback`

**Note:** Google OAuth is optional. The application works with email/password authentication without it.

## API Routes

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register a new user (rate limited)
- `POST /api/auth/login` - Login user (rate limited)
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/password` - Change password (protected)
- `DELETE /api/auth/account` - Delete user account (protected)

### AI Chat Routes (`/api/ai`)
- `POST /api/ai/chat` - Send message to AI (protected)
- `GET /api/ai/history` - Get all chat history (protected)
- `GET /api/ai/history/:id` - Get specific chat by ID (protected)
- `PUT /api/ai/history/:id` - Update chat title (protected)
- `DELETE /api/ai/history/:id` - Delete chat (protected)
- `POST /api/ai/new-chat` - Create new chat (protected)

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

### Chat Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required, indexed),
  title: String (default: 'New Chat'),
  messages: [{
    role: String (enum: 'user', 'assistant'),
    content: String,
    image: String (base64, optional),
    timestamp: Date
  }],
  language: String (enum: 'en', 'hi', 'pa', 'bn', 'ta', default: 'en'),
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

### Week 6: Security & Authentication Enhancements
- **JWT Authentication**: Implemented secure JWT-based authentication with token generation and verification
- **Password Hashing**: Integrated bcryptjs for secure password hashing (10 salt rounds)
- **Google OAuth Login**: Implemented Google OAuth 2.0 with Passport.js for social authentication
  - OAuth users created with bcrypt-hashed random passwords
  - JWT token generation on successful OAuth callback
  - Redirect to frontend with token in URL
  - Optional configuration (server runs without OAuth credentials)
- **Protected Routes**: Created ProtectedRoute component for frontend route protection
  - Protects Dashboard, AI Chat, and Account Settings pages
  - Automatic redirect to login for unauthenticated users
  - Navigation preservation - users redirected to intended page after login
- **Input Validation**: Added express-validator for all API endpoints
  - Register: name (min 2 chars), valid email, password (min 6 chars)
  - Login: valid email, password required
  - Profile updates: name, farmLocation, cropType validation
  - Password change: current and new password validation
  - Advisory queries: crop (min 2 chars), issue (min 5 chars)
  - Crop reports: crop (min 2 chars), disease (min 2 chars), severity validation
  - Returns HTTP 400 with detailed error messages
- **Rate Limiting**: Implemented express-rate-limit on authentication endpoints
  - 5 requests per 15 minutes per IP address
  - Applied to POST /api/auth/register and /api/auth/login
  - Returns HTTP 429 with friendly error message
- **CORS Security**: Updated CORS configuration to use environment-based origin
  - Uses CORS_ORIGIN environment variable
  - Credentials enabled for cookie support
  - No wildcard usage for enhanced security
- **JWT Expiration Handling**: Automatic logout on token expiration
  - 401 response detection in API client
  - Automatic token and user data cleanup
  - Redirect to login with navigation preservation
- **User Profile Management**: Complete CRUD operations
  - Get current user profile (GET /api/auth/me)
  - Update profile (PUT /api/auth/profile)
  - Change password with verification (PUT /api/auth/password)
  - Delete account with confirmation (DELETE /api/auth/account)
- **Crop Report APIs**: Full crop health tracking
  - Create report (POST /api/crop/report)
  - Get all reports (GET /api/crop/reports)
  - Get report by ID (GET /api/crop/reports/:id)
- **Dashboard Statistics API**: Analytics endpoints
  - Overall statistics (GET /api/dashboard/stats)
  - User-specific statistics (GET /api/dashboard/user-stats)
- **Postman API Testing**: Complete Postman collection
  - All endpoints documented and tested
  - Auto-save token script for authentication
  - Environment variables for easy configuration
- **MongoDB Atlas Integration**: Cloud database connection
  - Mongoose models for User, Query, and CropHealth
  - Proper relationships and indexing
  - Data persistence across sessions

### Week 7: AI Integration
- **Gemini AI Integration**: Integrated Google Gemini 1.5 Flash model for AI-powered advisory
  - Agriculture-specific system prompt with expert farming knowledge
  - Context-aware conversations with multi-turn dialogue support
  - Specialized in crop diseases, fertilizers, irrigation, pest control, soil health
  - Secure API key storage in environment variables (.env file)
  - Error handling with detailed logging for debugging
- **AI Chat Assistant**: Complete conversational interface inspired by ChatGPT
  - Modern left sidebar for conversation history
  - Main chat window with message bubbles
  - Responsive design with mobile support
  - Smooth animations with Framer Motion
  - Typing indicator while AI generates response
  - Auto-scroll to latest message
  - Message timestamps
  - Suggested prompt chips for quick actions
- **Crop Image Analysis**: Gemini Vision integration for disease detection
  - Upload JPG, JPEG, PNG images
  - Image preview before sending
  - AI analyzes crop images for disease detection
  - Provides diagnosis, treatment, and prevention tips
  - Image handling with base64 encoding
- **Multilingual Responses**: Support for 5 Indian languages
  - English, Hindi, Punjabi, Bengali, Tamil
  - Language selector in sidebar
  - AI responses generated in selected language
  - Voice recognition adapts to selected language
- **Secure API Key Storage**: Environment-based configuration
  - GEMINI_API_KEY stored in .env file
  - .env included in .gitignore to prevent accidental commits
  - API key validation on server startup
  - Graceful degradation when API key is missing
- **Error Handling**: Comprehensive error management
  - Detailed error logging for Gemini API failures
  - User-friendly error messages via toast notifications
  - Graceful fallback for API failures
  - Input validation for image uploads (size limits)
- **Loading State**: Visual feedback during AI processing
  - Loading spinner during AI response generation
  - Typing indicator in chat interface
  - Disabled input while AI is processing
  - Smooth transitions between states
- **MongoDB Conversation History**: Persistent chat storage
  - Chat model for conversation storage in MongoDB
  - Create new chats with auto-titling based on first message
  - Load previous conversations from database
  - Delete conversations with ownership verification
  - Most recent chats displayed first
  - Message history with role, content, image, and timestamp
- **Backend Architecture**: New AI-specific infrastructure
  - AI service with @google/generative-ai SDK
  - Dedicated AI controller and routes
  - JWT-protected endpoints for chat operations
  - Image handling with base64 encoding
- **Markdown Rendering**: Formatted AI responses
  - react-markdown with remark-gfm
  - GitHub Flavored Markdown support
  - Tables, lists, code blocks
  - Proper styling with Tailwind CSS

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