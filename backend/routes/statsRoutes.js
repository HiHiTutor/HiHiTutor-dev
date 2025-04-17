const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const { getStats } = require('../services/statsService');

// Get all statistics (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 