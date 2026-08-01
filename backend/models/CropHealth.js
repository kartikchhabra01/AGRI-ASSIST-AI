/**
 * CropHealth Model
 * Mongoose schema for crop health reports
 */

const mongoose = require('mongoose');

const cropHealthSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  crop: {
    type: String,
    trim: true,
    default: null,
    minlength: [2, 'Crop name must be at least 2 characters long']
  },
  disease: {
    type: String,
    trim: true,
    default: null,
    minlength: [2, 'Disease name must be at least 2 characters long']
  },
  severity: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    // Preserve the existing report baseline when Gemini does not explicitly
    // classify severity; explicit values from the analysis take precedence.
    default: 'Moderate'
  },
  diagnosis: {
    type: String,
    default: null
  },
  recommendation: {
    type: String,
    default: null
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    default: null
  },
  affectedArea: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster searches
cropHealthSchema.index({ userId: 1 });
cropHealthSchema.index({ crop: 1 });

const CropHealth = mongoose.model('CropHealth', cropHealthSchema);

module.exports = CropHealth;
