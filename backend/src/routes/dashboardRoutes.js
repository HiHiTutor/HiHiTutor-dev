const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { getDashboardStats } = require('../services/statsService');

// 獲取儀表板統計數據
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('獲取儀表板統計失敗:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 