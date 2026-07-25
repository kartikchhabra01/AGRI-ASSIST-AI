const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const { generateResponse, analyzeImage } = require('../services/aiService');

/**
 * Send message to AI and get response
 * POST /api/ai/chat
 */
const sendMessage = async (req, res) => {
  try {
    const { message, chatId, image, language = 'en' } = req.body;
    const userId = req.userId;

    if (!message && !image) {
      return res.status(400).json({
        success: false,
        message: 'Message or image is required'
      });
    }

    let chat;

    // Create new chat or get existing
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId });
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: 'Chat not found'
        });
      }
    } else {
      // Create new chat with title from first message
      const title = message ? message.substring(0, 50) + (message.length > 50 ? '...' : '') : 'Image Analysis';
      chat = await Chat.create({
        userId,
        title,
        language,
        messages: []
      });
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content: message || '',
      image: image || null,
      timestamp: new Date()
    };
    chat.messages.push(userMessage);

    // Generate AI response with conversation context
    const aiResponse = await generateResponse(
      chat.messages,
      language,
      image
    );

    // Add AI response
    const assistantMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    chat.messages.push(assistantMessage);

    // Update chat title if it's the first exchange
    if (chat.messages.length === 2) {
      chat.title = message ? message.substring(0, 50) + (message.length > 50 ? '...' : '') : 'Image Analysis';
    }

    await chat.save();

    res.json({
      success: true,
      chatId: chat._id,
      message: assistantMessage
    });
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

/**
 * Get all chat history for user
 * GET /api/ai/history
 */
const getChatHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const chats = await Chat.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $sort: { updatedAt: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          updatedAt: 1,
          messageCount: { $size: '$messages' }
        }
      }
    ]);

    const chatList = chats.map(chat => ({
      _id: chat._id,
      title: chat.title,
      updatedAt: chat.updatedAt,
      messageCount: chat.messageCount
    }));

    res.json({
      success: true,
      chats: chatList
    });
  } catch (error) {
    console.error('Get Chat History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat history'
    });
  }
};

/**
 * Get specific chat by ID
 * GET /api/ai/history/:id
 */
const getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Get Chat By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat'
    });
  }
};

/**
 * Delete chat
 * DELETE /api/ai/history/:id
 */
const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const chat = await Chat.findOneAndDelete({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Delete Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat'
    });
  }
};

/**
 * Create new chat
 * POST /api/ai/new-chat
 */
const createNewChat = async (req, res) => {
  try {
    const { language = 'en' } = req.body;
    const userId = req.userId;

    const chat = await Chat.create({
      userId,
      title: 'New Chat',
      language,
      messages: []
    });

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Create New Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create new chat'
    });
  }
};

/**
 * Update chat title
 * PUT /api/ai/history/:id
 */
const updateChatTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.userId;

    const chat = await Chat.findOneAndUpdate(
      { _id: id, userId },
      { title },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Update Chat Title Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update chat title'
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getChatById,
  deleteChat,
  createNewChat,
  updateChatTitle
};
