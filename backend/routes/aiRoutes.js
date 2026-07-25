const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// All AI routes are protected
router.use(authMiddleware);

// Send message to AI
router.post('/chat', aiController.sendMessage);

// Get all chat history
router.get('/history', aiController.getChatHistory);

// Get specific chat by ID
router.get('/history/:id', aiController.getChatById);

// Update chat title
router.put('/history/:id', aiController.updateChatTitle);

// Delete chat
router.delete('/history/:id', aiController.deleteChat);

// Create new chat
router.post('/new-chat', aiController.createNewChat);

module.exports = router;
