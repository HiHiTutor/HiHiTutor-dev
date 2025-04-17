const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Advertisement = require('../models/Advertisement');

// Get active advertisements by position
router.get('/active/:position', async (req, res) => {
  try {
    const now = new Date();
    const ads = await Advertisement.find({
      position: req.params.position,
      active: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all advertisements (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const ads = await Advertisement.find()
      .populate('advertiser', 'name email')
      .sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new advertisement (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      title,
      imageUrl,
      link,
      position,
      startDate,
      endDate,
      advertiser
    } = req.body;

    if (!title || !imageUrl || !link || !position || !startDate || !endDate || !advertiser) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const ad = new Advertisement({
      title,
      imageUrl,
      link,
      position,
      startDate,
      endDate,
      advertiser
    });

    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update advertisement (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }
    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete advertisement (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndDelete(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }
    res.json({ message: 'Advertisement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Track advertisement click
router.post('/:id/click', async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }
    res.json({ clicks: ad.clicks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 