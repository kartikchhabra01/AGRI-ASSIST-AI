/**
 * Dashboard Routes
 * Defines routes for dashboard statistics
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.get('/stats', authMiddleware, dashboardController.getStats);
router.get('/user-stats', authMiddleware, dashboardController.getUserStats);

module.exports = router;
