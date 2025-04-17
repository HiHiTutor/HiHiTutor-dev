const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { isAuthenticated } = require('../middleware/auth');
const User = require('../models/User');

// 測試路由
router.get('/test', (req, res) => {
  res.json({ message: '用戶路由測試成功' });
});

// 註冊
router.post('/register', async (req, res) => {
  try {
    const { phone, password, name, email } = req.body;

    // 檢查手機號是否已註冊
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: '此手機號已註冊' });
    }

    const user = new User({
      phone,
      password,
      name,
      email
    });

    await user.save();

    // 生成 JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 登入
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: '用戶不存在' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '密碼錯誤' });
    }

    // 更新最後登入時間
    user.lastLogin = new Date();
    await user.save();

    // 生成 JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 管理員登入
router.post('/adminLogin', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: '無效的管理員帳號' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '密碼錯誤' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 獲取當前用戶資料
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('tutorProfile');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 忘記密碼
router.post('/forgot-password', async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    
    if (!user) {
      return res.status(404).json({ message: '用戶不存在' });
    }

    // 生成重置令牌
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1小時有效期
    await user.save();

    // TODO: 發送重置密碼簡訊
    // 這裡需要整合簡訊服務

    res.json({ message: '重置密碼連結已發送到您的手機' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 重設密碼
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: '無效或過期的重置令牌' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: '密碼已成功重設' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 