const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subjects: [{
    type: String,
    required: true
  }],
  locations: [{
    type: String,
    required: true
  }],
  fee: {
    type: Number,
    required: true,
    min: 0
  },
  experience: {
    type: String,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  genderPreference: {
    type: String,
    enum: ['any', 'male', 'female'],
    default: 'any'
  },
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  },
  adLevel: {
    type: Number,
    enum: [0, 1, 2, 3], // 0: 一般, 1: 置頂, 2: 精選, 3: 熱門
    default: 0
  }
}, {
  timestamps: true
});

// 索引
postSchema.index({ verified: 1, status: 1 });
postSchema.index({ subjects: 1 });
postSchema.index({ locations: 1 });
postSchema.index({ adLevel: -1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema); 