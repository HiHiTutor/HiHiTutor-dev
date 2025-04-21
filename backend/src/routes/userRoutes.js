const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const Subscription = require('../models/Subscription');

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const subscription = await Subscription.findOne({
      user: req.user.id,
      status: 'active'
    });
    
    res.json({
      ...user.toObject(),
      subscription: subscription ? {
        planId: subscription.planId,
        status: subscription.status,
        endDate: subscription.endDate
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'phone', 'location', 'bio'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const user = await User.findById(req.user.id);
    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's ads
router.get('/ads', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user.id,
      status: 'active'
    });

    const ads = await Ad.find({ user: req.user.id });
    
    if (!subscription && ads.length >= 3) {
      return res.status(403).json({
        error: 'Free plan limit reached. Please upgrade to post more ads.',
        upgradeRequired: true
      });
    }

    if (subscription && ads.length >= subscription.features.maxAds) {
      return res.status(403).json({
        error: 'Plan limit reached. Please upgrade to post more ads.',
        upgradeRequired: true
      });
    }

    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's applications
router.get('/applications', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user.id,
      status: 'active'
    });

    const applications = await Application.find({ tutor: req.user.id });
    
    if (!subscription && applications.length >= 5) {
      return res.status(403).json({
        error: 'Free plan limit reached. Please upgrade to apply for more cases.',
        upgradeRequired: true
      });
    }

    if (subscription && applications.length >= subscription.features.maxApplications) {
      return res.status(403).json({
        error: 'Plan limit reached. Please upgrade to apply for more cases.',
        upgradeRequired: true
      });
    }

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user account
router.delete('/account', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.remove();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 