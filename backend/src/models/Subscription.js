const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  paymentId: {
    type: String,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  features: {
    maxAds: {
      type: Number,
      required: true
    },
    maxApplications: {
      type: Number,
      required: true
    },
    prioritySupport: {
      type: Boolean,
      default: false
    },
    analytics: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ paymentId: 1 }, { unique: true });
subscriptionSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Subscription', subscriptionSchema); 