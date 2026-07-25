/**
 * Advisory Routes
 * Defines routes for crop advisory queries
 */

const express = require('express');
const router = express.Router();
const advisoryController = require('../controllers/advisoryController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateAdvisoryQuery } = require('../middleware/validator');

// All routes are protected
router.post('/chat', authMiddleware, validateAdvisoryQuery, advisoryController.submitQuery);
router.get('/history', authMiddleware, advisoryController.getHistory);
router.get('/history/:id', authMiddleware, advisoryController.getQueryById);
router.get('/search', authMiddleware, advisoryController.searchQueries);
router.delete('/all', authMiddleware, advisoryController.deleteAllQueries);
router.put('/:id', authMiddleware, advisoryController.updateQuery);
router.delete('/:id', authMiddleware, advisoryController.deleteQuery);

module.exports = router;
