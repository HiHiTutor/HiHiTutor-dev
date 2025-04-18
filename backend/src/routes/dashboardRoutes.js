const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Case = require('../models/Case');
const Ad = require('../models/Ad');

// 獲取儀表板統計數據
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    // 用戶統計
    const totalUsers = await User.countDocuments();
    const totalTutors = await User.countDocuments({ role: 'tutor' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const verifiedTutors = await User.countDocuments({ role: 'tutor', isVerified: true });

    // 案例統計
    const totalCases = await Case.countDocuments();
    const pendingCases = await Case.countDocuments({ status: 'pending' });
    const activeCases = await Case.countDocuments({ status: 'active' });

    // 廣告統計
    const totalAds = await Ad.countDocuments();
    const activeAds = await Ad.countDocuments({ status: 'active' });

    // 最近的案例
    const recentCases = await Case.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name');

    res.json({
      users: {
        total: totalUsers,
        tutors: totalTutors,
        students: totalStudents,
        verifiedTutors
      },
      cases: {
        total: totalCases,
        pending: pendingCases,
        active: activeCases,
        recent: recentCases.map(c => ({
          id: c._id,
          title: c.title,
          status: c.status,
          createdBy: c.createdBy.name,
          createdAt: c.createdAt
        }))
      },
      ads: {
        total: totalAds,
        active: activeAds
      }
    });
  } catch (error) {
    console.error('獲取儀表板統計失敗:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 