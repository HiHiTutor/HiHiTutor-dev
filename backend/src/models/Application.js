const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ case: 1, tutor: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema); 