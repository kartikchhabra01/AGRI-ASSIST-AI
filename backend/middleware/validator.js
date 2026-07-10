/**
 * Input Validation Middleware
 * Uses express-validator to validate request inputs
 */

const { body, validationResult } = require('express-validator');

/**
 * Validation Result Handler
 * Checks for validation errors and returns formatted response
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Registration Validation Rules
 */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Location must not exceed 100 characters'),
  
  handleValidationErrors
];

/**
 * Login Validation Rules
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Profile Update Validation Rules
 */
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('farmLocation')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Farm location must not exceed 100 characters'),
  
  body('cropType')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Crop type must not exceed 50 characters'),
  
  handleValidationErrors
];

/**
 * Password Change Validation Rules
 */
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  
  handleValidationErrors
];

/**
 * Advisory Query Validation Rules
 */
const validateAdvisoryQuery = [
  body('crop')
    .trim()
    .notEmpty().withMessage('Crop name is required')
    .isLength({ min: 2 }).withMessage('Crop name must be at least 2 characters long'),
  
  body('issue')
    .trim()
    .notEmpty().withMessage('Issue description is required')
    .isLength({ min: 5 }).withMessage('Issue description must be at least 5 characters long'),
  
  handleValidationErrors
];

/**
 * Crop Health Report Validation Rules
 */
const validateCropReport = [
  body('crop')
    .trim()
    .notEmpty().withMessage('Crop name is required')
    .isLength({ min: 2 }).withMessage('Crop name must be at least 2 characters long'),
  
  body('disease')
    .trim()
    .notEmpty().withMessage('Disease name is required')
    .isLength({ min: 2 }).withMessage('Disease name must be at least 2 characters long'),
  
  body('severity')
    .optional()
    .isIn(['Low', 'Moderate', 'High']).withMessage('Severity must be Low, Moderate, or High'),
  
  body('affectedArea')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Affected area must not exceed 100 characters'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateAdvisoryQuery,
  validateCropReport
};
