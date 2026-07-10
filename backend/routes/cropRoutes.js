/**
 * Crop Routes
 * Defines routes for crop health reports
 */

const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateCropReport } = require('../middleware/validator');

// All routes are protected
router.post('/report', authMiddleware, validateCropReport, cropController.submitReport);
router.get('/reports', authMiddleware, cropController.getReports);
router.get('/reports/:id', authMiddleware, cropController.getReportById);

module.exports = router;
