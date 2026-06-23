/**
 * Crop Controller
 * Handles crop health reports
 */

const db = require('../config/db');
const CropHealth = require('../models/CropHealth');

/**
 * Submit a crop health report
 * POST /api/crop/report
 */
const submitReport = async (req, res, next) => {
  try {
    const { crop, disease, severity, affectedArea } = req.body;
    const userId = req.userId;

    // Validate input
    const validation = CropHealth.validate({ userId, crop, disease, severity });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Create report
    const reportData = {
      userId,
      crop,
      disease,
      severity,
      affectedArea
    };

    const savedReport = db.cropReports.create(reportData);

    // Return response
    res.status(201).json({
      success: true,
      message: 'Crop report submitted successfully',
      data: savedReport
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all crop reports for current user
 * GET /api/crop/reports
 */
const getReports = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Get all reports for this user
    const userReports = db.cropReports.findByUserId(userId);

    // Sort by creation date (newest first)
    userReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: userReports.length,
      data: userReports
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific crop report by ID
 * GET /api/crop/reports/:id
 */
const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Find the report
    const report = db.cropReports.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user owns this report
    if (report.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitReport,
  getReports,
  getReportById
};
