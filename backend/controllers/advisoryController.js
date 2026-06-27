/**
 * Advisory Controller
 * Handles AI crop advisory queries and history
 */

const db = require('../config/db');
const Query = require('../models/Query');
const { getDiagnosis } = require('../services/aiService');

/**
 * Submit a new crop advisory query
 * POST /api/advisory/chat
 */
const submitQuery = async (req, res, next) => {
  try {
    const { crop, issue } = req.body;
    const userId = req.userId;

    // Validate input
    const validation = Query.validate({ userId, crop, issue });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Get AI diagnosis
    const aiResponse = await getDiagnosis(crop, issue);

    // Save query to database
    const queryData = {
      userId,
      crop,
      issue,
      diagnosis: aiResponse.diagnosis,
      recommendation: aiResponse.recommendation
    };

    const savedQuery = db.queries.create(queryData);

    // Return response
    res.status(201).json({
      success: true,
      message: 'Query processed successfully',
      data: savedQuery
    });
  } catch (error) {
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

    // Get all queries for this user
    const userQueries = db.queries.findByUserId(userId);

    // Sort by creation date (newest first)
    userQueries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: userQueries.length,
      data: userQueries
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

    // Find the query
    const query = db.queries.findById(id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    // Check if user owns this query
    if (query.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: query
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

    // Search all queries
    const allResults = db.queries.search(q);

    // Filter to only show user's queries
    const userResults = allResults.filter(query => query.userId === userId);

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
    const query = db.queries.findById(id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    // Check if user owns this query
    if (query.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Validate input if provided
    if (crop || issue) {
      const validation = Query.validate({ 
        userId, 
        crop: crop || query.crop, 
        issue: issue || query.issue 
      });
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }
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

    const updatedQuery = db.queries.update(id, updates);

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

    // Find the query
    const query = db.queries.findById(id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    // Check if user owns this query
    if (query.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete query
    db.queries.delete(id);

    res.status(200).json({
      success: true,
      message: 'Query deleted successfully'
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

    // Get all user queries
    const userQueries = db.queries.findByUserId(userId);

    // Delete all queries
    userQueries.forEach(query => {
      db.queries.delete(query.id);
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${userQueries.length} queries successfully`
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
