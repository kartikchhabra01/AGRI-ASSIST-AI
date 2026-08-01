/**
 * Advisory Controller
 * Handles AI crop advisory queries and history
 */

const Query = require('../models/Query');
const Chat = require('../models/Chat');
const { getDiagnosis } = require('../services/aiService');

/**
 * Submit a new crop advisory query
 * POST /api/advisory/chat
 */
const submitQuery = async (req, res, next) => {
  try {
    const { crop, issue } = req.body;
    const userId = req.userId;

    // Get AI diagnosis
    const aiResponse = await getDiagnosis(crop, issue);

    // Save query to database
    const savedQuery = await Query.create({
      userId,
      crop,
      issue,
      diagnosis: aiResponse.diagnosis,
      recommendation: aiResponse.recommendation
    });

    // Return response
    res.status(201).json({
      success: true,
      message: 'Query processed successfully',
      data: savedQuery
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    next(error);
  }
};

/**
 * Get query history for current user
 * GET /api/advisory/history
 */
const getHistory = async (req, res, next) => {
  try {
    const userId = req.userId;

    // AI Chat persists conversations in Chat, while this legacy endpoint was
    // previously reading only Query documents. Return both existing record
    // types so the Advisory History view reflects successful AI conversations
    // without dropping older advisory queries.
    const [userQueries, userChats] = await Promise.all([
      Query.find({ userId }).sort({ createdAt: -1 }),
      Chat.find({ userId }).sort({ updatedAt: -1 })
    ]);

    const chatsAsHistory = userChats.map(chat => {
      const firstUserMessage = chat.messages.find(message => message.role === 'user');
      return {
        _id: chat._id,
        title: chat.title,
        crop: chat.title,
        issue: firstUserMessage?.content || 'Image analysis',
        messages: chat.messages,
        language: chat.language,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        source: 'chat'
      };
    });

    const history = [...userQueries, ...chatsAsHistory]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific query by ID
 * GET /api/advisory/history/:id
 */
const getQueryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // History includes both legacy advisory Query records and AI Chat
    // conversations, so either type can be opened from this endpoint.
    const [query, chat] = await Promise.all([
      Query.findOne({ _id: id, userId }),
      Chat.findOne({ _id: id, userId })
    ]);

    if (!query && !chat) {
      return res.status(404).json({
        success: false,
        message: 'History item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: query || chat
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search queries
 * GET /api/advisory/search?q=
 */
const searchQueries = async (req, res, next) => {
  try {
    const { q } = req.query;
    const userId = req.userId;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter is required'
      });
    }

    // Search queries for this user
    const userResults = await Query.find({
      userId,
      $or: [
        { crop: { $regex: q, $options: 'i' } },
        { issue: { $regex: q, $options: 'i' } },
        { diagnosis: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: userResults.length,
      data: userResults
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a query
 * PUT /api/advisory/:id (protected)
 */
const updateQuery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { crop, issue } = req.body;
    const userId = req.userId;

    // Find the query
    const query = await Query.findById(id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    // Check if user owns this query
    if (query.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update query
    const updates = {};
    if (crop) updates.crop = crop;
    if (issue) updates.issue = issue;

    // If crop or issue changed, get new AI diagnosis
    if (crop !== query.crop || issue !== query.issue) {
      const aiResponse = await getDiagnosis(crop || query.crop, issue || query.issue);
      updates.diagnosis = aiResponse.diagnosis;
      updates.recommendation = aiResponse.recommendation;
    }

    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Query updated successfully',
      data: updatedQuery
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a query
 * DELETE /api/advisory/:id (protected)
 */
const deleteQuery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Settings deletes an item through the Advisory API. Because that list now
    // contains Chat-backed AI conversations too, delete the matching record
    // from either model while always scoping the operation to its owner.
    const [deletedQuery, deletedChat] = await Promise.all([
      Query.findOneAndDelete({ _id: id, userId }),
      Chat.findOneAndDelete({ _id: id, userId })
    ]);

    if (!deletedQuery && !deletedChat) {
      return res.status(404).json({
        success: false,
        message: 'History item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'History item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete all queries for current user
 * DELETE /api/advisory/all (protected)
 */
const deleteAllQueries = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Delete all history records represented by this API.
    const [queryResult, chatResult] = await Promise.all([
      Query.deleteMany({ userId }),
      Chat.deleteMany({ userId })
    ]);
    const deletedCount = queryResult.deletedCount + chatResult.deletedCount;

    res.status(200).json({
      success: true,
      message: `Deleted ${deletedCount} history items successfully`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitQuery,
  getHistory,
  getQueryById,
  searchQueries,
  updateQuery,
  deleteQuery,
  deleteAllQueries
};
