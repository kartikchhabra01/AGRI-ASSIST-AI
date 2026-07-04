/**
 * Crop Controller
 * Handles crop health reports
 */

const CropHealth = require('../models/CropHealth');

/**
 * Submit a crop health report
 * POST /api/crop/report
 */
const submitReport = async (req, res, next) => {
  try {
    const { crop, disease, severity, affectedArea } = req.body;
    const userId = req.userId;

    // Create report
    const savedReport = await CropHealth.create({
      userId,
      crop,
      disease,
      severity,
      affectedArea
    });

    // Return response
    res.status(201).json({
      success: true,
      message: 'Crop report submitted successfully',
      data: savedReport
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
 * Get all crop reports for current user
 * GET /api/crop/reports
 */
const getReports = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Get all reports for this user, sorted by creation date (newest first)
    const userReports = await CropHealth.find({ userId }).sort({ createdAt: -1 });

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
    const report = await CropHealth.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user owns this report
    if (report.userId.toString() !== userId) {
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
