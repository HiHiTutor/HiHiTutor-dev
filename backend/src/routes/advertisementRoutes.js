const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Advertisement = require('../../models/Advertisement');

// 獲取所有廣告
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const advertisements = await Advertisement.find()
      .sort({ createdAt: -1 });
    res.json(advertisements);
  } catch (error) {
    console.error('Error getting advertisements:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 