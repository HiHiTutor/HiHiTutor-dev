const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const auth = require('../middleware/auth');
const { checkSubscription } = require('../middleware/checkSubscription');

// Get all ads
router.get('/', async (req, res) => {
  try {
    const ads = await Ad.find({ status: 'active' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new ad
router.post('/', auth, checkSubscription('ads'), async (req, res) => {
  try {
    const ad = new Ad({
      ...req.body,
      user: req.user.id,
      features: {
        priority: req.subscription.features.prioritySupport || false
      }
    });
    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's ads
router.get('/my', auth, async (req, res) => {
  try {
    const ads = await Ad.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific ad
router.get('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
      .populate('user', 'name email');
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ad
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'price', 'location', 'status'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const ad = await Ad.findOne({ _id: req.params.id, user: req.user.id });
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    updates.forEach(update => ad[update] = req.body[update]);
    await ad.save();
    res.json(ad);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete ad
router.delete('/:id', auth, async (req, res) => {
  try {
    const ad = await Ad.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }
    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 