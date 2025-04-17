const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 驗證 JWT token
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '未提供認證令牌' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: '用戶不存在' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: '無效的認證令牌' });
  }
};

// 驗證管理員權限
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: '需要管理員權限' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: '權限驗證錯誤' });
  }
};

// 驗證導師權限
const isTutor = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'tutor') {
      return res.status(403).json({ message: '需要導師權限' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: '權限驗證錯誤' });
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isTutor
}; 