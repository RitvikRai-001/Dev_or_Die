import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/notification.model.js";

/**
 * GET ALL NOTIFICATIONS FOR LOGGED-IN USER
 */
const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 }) // newest first
    .limit(20);

  return res.status(200).json({
    success: true,
    results: notifications.length,
    notifications,
  });
});

/**
 * GET UNREAD NOTIFICATION COUNT (🔔 badge)
 */
const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const count = await Notification.countDocuments({
    user: userId,
    isRead: false,
  });

  return res.status(200).json({
    success: true,
    unreadCount: count,
  });
});

// MARK NOTIFICATION AS READ
 
const markNotificationRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
  return res.status(404).json({
    success: false,
    message: "Notification not found"
  });
}

  return res.status(200).json({
    success: true,
    notification,
  });
});

/**
 * MARK ALL AS READ
 */
const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true }
  );

  return res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

export {
  getUserNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllRead,
};
