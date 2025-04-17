const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Case = require('../models/Case');

// 查看所有用戶
router.get('/users', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('tutorProfile');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 審核用戶
router.put('/users/:id/approve', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: '用戶不存在' });
    }

    user.isVerified = true;
    if (req.body.role) {
      user.role = req.body.role;
    }
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 查看所有個案
router.get('/cases', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const cases = await Case.find()
      .populate('createdBy', 'name phone')
      .populate('applications.tutor', 'name phone')
      .sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 審核個案
router.put('/cases/:id/approve', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ message: '個案不存在' });
    }

    caseItem.status = req.body.status || 'approved';
    if (req.body.selectedTutor) {
      caseItem.selectedTutor = req.body.selectedTutor;
    }
    await caseItem.save();

    res.json(caseItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 