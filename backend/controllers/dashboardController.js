/**
 * Dashboard Controller
 * Handles dashboard statistics and analytics
 */

const User = require('../models/User');
const Query = require('../models/Query');
const CropHealth = require('../models/CropHealth');

/**
 * Get dashboard statistics
 * GET /api/dashboard/stats
 */
const getStats = async (req, res, next) => {
  try {
    // Get all data
    const totalUsers = await User.countDocuments();
    const totalQueries = await Query.countDocuments();
    const totalCropReports = await CropHealth.countDocuments();

    // Find most common disease
    const diseaseAggregation = await CropHealth.aggregate([
      { $group: { _id: '$disease', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const mostCommonDisease = diseaseAggregation.length > 0 
      ? diseaseAggregation[0]._id 
      : 'No data';

    // Find most common crop
    const cropAggregation = await Query.aggregate([
      { $group: { _id: '$crop', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const mostCommonCrop = cropAggregation.length > 0 
      ? cropAggregation[0]._id 
      : 'No data';

    // Calculate queries in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentQueries = await Query.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Calculate reports by severity
    const severityBreakdown = await CropHealth.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    const severityCount = {
      Low: 0,
      Moderate: 0,
      High: 0
    };

    severityBreakdown.forEach(item => {
      if (severityCount[item._id] !== undefined) {
        severityCount[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalQueries,
        totalCropReports,
        mostCommonDisease,
        mostCommonCrop,
        recentQueries,
        severityBreakdown: severityCount
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user-specific dashboard data
 * GET /api/dashboard/user-stats
 */
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Get user's data
    const totalQueries = await Query.countDocuments({ userId });
    const totalReports = await CropHealth.countDocuments({ userId });

    // Get recent queries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentQueries = await Query.countDocuments({
      userId,
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get crops queried
    const cropsQueried = await Query.distinct('crop', { userId });

    // Get last activity
    const lastQuery = await Query.findOne({ userId }).sort({ createdAt: -1 });
    const lastReport = await CropHealth.findOne({ userId }).sort({ createdAt: -1 });

    const lastActivity = lastQuery && lastReport
      ? (lastQuery.createdAt > lastReport.createdAt ? lastQuery.createdAt : lastReport.createdAt)
      : lastQuery
        ? lastQuery.createdAt
        : lastReport
          ? lastReport.createdAt
          : null;

    res.status(200).json({
      success: true,
      data: {
        totalQueries,
        totalReports,
        recentQueries,
        cropsQueried,
        lastActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getUserStats
};
