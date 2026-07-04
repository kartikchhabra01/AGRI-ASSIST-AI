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
    required: [true, 'Crop name is required'],
    trim: true,
    minlength: [2, 'Crop name must be at least 2 characters long']
  },
  disease: {
    type: String,
    required: [true, 'Disease name is required'],
    trim: true,
    minlength: [2, 'Disease name must be at least 2 characters long']
  },
  severity: {
    type: String,
    required: [true, 'Severity is required'],
    enum: ['Low', 'Moderate', 'High'],
    default: 'Moderate'
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
