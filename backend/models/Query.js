/**
 * Query Model
 * Mongoose schema for crop advisory queries
 */

const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
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
  issue: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true,
    minlength: [5, 'Issue description must be at least 5 characters long']
  },
  diagnosis: {
    type: String,
    default: null
  },
  recommendation: {
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
querySchema.index({ userId: 1 });
querySchema.index({ crop: 1, issue: 1 });

const Query = mongoose.model('Query', querySchema);

module.exports = Query;
