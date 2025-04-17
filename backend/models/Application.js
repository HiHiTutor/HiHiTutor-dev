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
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// 確保同一個導師不能重複申請同一個個案
applicationSchema.index({ case: 1, tutor: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema); 