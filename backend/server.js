const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables from multiple possible locations
const envPaths = [
  path.join(__dirname, '.env'),
  path.join(__dirname, '.env.local'),
  path.join(process.cwd(), '.env')
];

for (const envPath of envPaths) {
  if (require('fs').existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`Loaded .env from: ${envPath}`);
    break;
  }
}

// Passport reads its OAuth configuration during module initialization, so it
// must be loaded only after environment variables have been populated.
const passport = require('./config/passport');

// Connect to MongoDB
connectDB();

// Import routes
const authRoutes = require('./routes/authRoutes');
const advisoryRoutes = require('./routes/advisoryRoutes');
const cropRoutes = require('./routes/cropRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || `http://localhost:${process.env.FRONTEND_PORT || 5173}`;

// Middleware
// Chat images are sent as base64 JSON, which exceeds Express's 100kb default.
app.use(express.json({ limit: '6mb' }));
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// OAuth returns a JWT, so Passport sessions are not needed.
app.use(passport.initialize());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'AGRI ASSIST AI Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      advisory: '/api/advisory',
      crop: '/api/crop',
      dashboard: '/api/dashboard',
      ai: '/api/ai'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (must be last)
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌱 AGRI ASSIST AI Backend API`);
});

module.exports = app;
