/**
 * Authentication Routes
 * Defines routes for user authentication
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, validateProfileUpdate, validatePasswordChange } = require('../middleware/validator');
const { authLimiter } = require('../middleware/rateLimiter');
const passport = require('../config/passport');

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleCallback);

// Public routes with validation and rate limiting
router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);

// Protected routes with validation
router.get('/me', authMiddleware, authController.getMe);
router.put('/profile', authMiddleware, validateProfileUpdate, authController.updateProfile);
router.put('/password', authMiddleware, validatePasswordChange, authController.changePassword);
router.delete('/account', authMiddleware, authController.deleteAccount);

module.exports = router;
