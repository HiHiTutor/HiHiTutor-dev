const Subscription = require('../models/Subscription');

const checkSubscription = (feature) => {
  return async (req, res, next) => {
    try {
      const subscription = await Subscription.findOne({
        user: req.user.id,
        status: 'active'
      });

      // Set default limits for free tier
      const freeLimits = {
        maxAds: 3,
        maxApplications: 5,
        prioritySupport: false,
        analytics: false
      };

      // Get current usage
      let currentUsage;
      switch (feature) {
        case 'ads':
          currentUsage = await Ad.countDocuments({ user: req.user.id });
          break;
        case 'applications':
          currentUsage = await Application.countDocuments({ tutor: req.user.id });
          break;
        default:
          return next();
      }

      // Check limits based on subscription status
      if (!subscription) {
        if (currentUsage >= freeLimits[`max${feature.charAt(0).toUpperCase() + feature.slice(1)}`]) {
          return res.status(403).json({
            error: `Free plan limit reached. Please upgrade to use more ${feature}.`,
            upgradeRequired: true
          });
        }
      } else if (currentUsage >= subscription.features[`max${feature.charAt(0).toUpperCase() + feature.slice(1)}`]) {
        return res.status(403).json({
          error: `Plan limit reached. Please upgrade to use more ${feature}.`,
          upgradeRequired: true
        });
      }

      // Add subscription info to request for use in routes
      req.subscription = subscription || { features: freeLimits };
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

const checkFeature = (feature) => {
  return async (req, res, next) => {
    try {
      const subscription = await Subscription.findOne({
        user: req.user.id,
        status: 'active'
      });

      // Set default features for free tier
      const freeLimits = {
        prioritySupport: false,
        analytics: false
      };

      if (!subscription && !freeLimits[feature]) {
        return res.status(403).json({
          error: `This feature requires a subscription. Please upgrade to access ${feature}.`,
          upgradeRequired: true
        });
      }

      if (subscription && !subscription.features[feature]) {
        return res.status(403).json({
          error: `Your current plan doesn't include ${feature}. Please upgrade to access this feature.`,
          upgradeRequired: true
        });
      }

      // Add subscription info to request for use in routes
      req.subscription = subscription || { features: freeLimits };
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

module.exports = {
  checkSubscription,
  checkFeature
}; 