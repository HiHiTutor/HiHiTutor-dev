const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  position: {
    type: String,
    enum: ['header', 'sidebar', 'footer'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add index for active advertisements
advertisementSchema.index({ active: 1, position: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Advertisement', advertisementSchema); 