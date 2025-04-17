const Notification = require('../models/Notification');

const createNotification = async (recipientId, type, title, message, relatedTo, onModel) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      type,
      title,
      message,
      relatedTo,
      onModel
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

const getNotifications = async (userId) => {
  try {
    return await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

const markAsRead = async (notificationId) => {
  try {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

const getUnreadCount = async (userId) => {
  try {
    return await Notification.countDocuments({ recipient: userId, read: false });
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  getUnreadCount
}; 