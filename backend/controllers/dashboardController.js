/**
 * Dashboard Controller
 * Handles dashboard statistics and analytics
 */

const db = require('../config/db');

/**
 * Get dashboard statistics
 * GET /api/dashboard/stats
 */
const getStats = async (req, res, next) => {
  try {
    // Get all data
    const allUsers = db.users.findAll();
    const allQueries = db.queries.findAll();
    const allReports = db.cropReports.findAll();

    // Calculate statistics
    const totalUsers = allUsers.length;
    const totalQueries = allQueries.length;
    const totalCropReports = allReports.length;

    // Find most common disease
    const diseaseCount = {};
    allReports.forEach(report => {
      const disease = report.disease.toLowerCase();
      diseaseCount[disease] = (diseaseCount[disease] || 0) + 1;
    });

    let mostCommonDisease = 'No data';
    let maxCount = 0;

    for (const [disease, count] of Object.entries(diseaseCount)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonDisease = disease.charAt(0).toUpperCase() + disease.slice(1);
      }
    }

    // Find most common crop
    const cropCount = {};
    allQueries.forEach(query => {
      const crop = query.crop.toLowerCase();
      cropCount[crop] = (cropCount[crop] || 0) + 1;
    });

    let mostCommonCrop = 'No data';
    maxCount = 0;

    for (const [crop, count] of Object.entries(cropCount)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonCrop = crop.charAt(0).toUpperCase() + crop.slice(1);
      }
    }

    // Calculate queries in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentQueries = allQueries.filter(query => 
      new Date(query.createdAt) >= sevenDaysAgo
    );

    // Calculate reports by severity
    const severityCount = {
      Low: 0,
      Moderate: 0,
      High: 0
    };

    allReports.forEach(report => {
      if (severityCount[report.severity] !== undefined) {
        severityCount[report.severity]++;
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
        recentQueries: recentQueries.length,
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
    const userQueries = db.queries.findByUserId(userId);
    const userReports = db.cropReports.findByUserId(userId);

    // Calculate statistics
    const totalQueries = userQueries.length;
    const totalReports = userReports.length;

    // Get recent queries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentQueries = userQueries.filter(query => 
      new Date(query.createdAt) >= sevenDaysAgo
    );

    // Get crops queried
    const cropsQueried = [...new Set(userQueries.map(q => q.crop))];

    res.status(200).json({
      success: true,
      data: {
        totalQueries,
        totalReports,
        recentQueries: recentQueries.length,
        cropsQueried,
        lastActivity: userQueries.length > 0 
          ? userQueries[0].createdAt 
          : userReports.length > 0 
            ? userReports[0].createdAt 
            : null
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
