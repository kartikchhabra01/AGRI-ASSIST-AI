/**
 * Advisory Routes
 * Defines routes for crop advisory queries
 */

const express = require('express');
const router = express.Router();
const advisoryController = require('../controllers/advisoryController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.post('/chat', authMiddleware, advisoryController.submitQuery);
router.get('/history', authMiddleware, advisoryController.getHistory);
router.get('/history/:id', authMiddleware, advisoryController.getQueryById);
router.get('/search', authMiddleware, advisoryController.searchQueries);

module.exports = router;
