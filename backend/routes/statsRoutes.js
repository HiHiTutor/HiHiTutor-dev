const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const { getStats, getDashboard } = require('../services/statsService');

// Get all statistics (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard statistics (admin only)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const stats = await getDashboard();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 