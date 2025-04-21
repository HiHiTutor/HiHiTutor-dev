const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createNotification,
  getNotifications,
  markAsRead,
  getUnreadCount
} = require('../services/notificationService');

// Get user's notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await getNotifications(req.user._id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unread notification count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await getUnreadCount(req.user._id);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 