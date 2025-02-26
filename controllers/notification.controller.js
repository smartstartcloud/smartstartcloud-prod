import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";
import { extractToken } from "../utils/generateToken.js";

export const sendNotification = async (req, role, type, message, metadata={}) => {
    const testToken = req.headers.cookie;
    const { userId } = extractToken(testToken);
    // Find users with the given role
    const users = await User.find({ role: { $in: role } }).select("_id");

    if (users.length === 0) {
        console.log(`No users found with role: ${role}`);
        return;
    }

    const recipientIds = users.map(user => user._id);

    // Create the notification
    const notification = new Notification({
      recipients: recipientIds,
      sender: userId || null,
      type,
      message,
      metadata, // Optional metadata for the notification (e.g., task details, alert message)
    });
    await notification.save();
    console.log(`Notification sent to ${users.length} users with role: ${role}`);
}

export const fetchNewNotification = async (req, res) => {
    const { userId } = req.body
    try {
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      const notifications = await Notification.find({
        recipients: { $in: [userId] }, // Check if userId exists in the recipients array
        isReadBy: { $nin: [userId] }, // Ensure userId is NOT in isReadBy array
      })
        .sort({ createdAt: -1 }) // Latest notifications first

      res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId, userId } = req.body;

    // Validate input
    if (!notificationId || !userId) {
      return res
        .status(400)
        .json({ success: false, error: "Missing notificationId or userId" });
    }

    // Find the notification
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, error: "Notification not found" });
    }

    // Check if the user has already marked it as read
    if (!notification.isReadBy.includes(userId)) {
      notification.isReadBy.push(userId);
      await notification.save();
    }

    return res.status(200).json({
      success: true,
      message: `User ${userId} marked notification ${notificationId} as read`,
      notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

const deleteFullyReadNotifications = async () => {
  const notifications = await Notification.find();

  for (let notification of notifications) {
    const totalRecipients = notification.recipients.length;
    const totalReaders = notification.isReadBy.length;

    // Condition: If recipients are less than 3, all must read. If 3 or more, at least 3 should read.
    const requiredReads = totalRecipients < 3 ? totalRecipients : 3;

    if (totalReaders >= requiredReads) {
      await Notification.findByIdAndDelete(notification._id);
      console.log(
        `Deleted notification ${notification._id} as required users have read it`
      );
    }
  }
}

// Run cleanup every hour
setInterval(deleteFullyReadNotifications, 60 * 60 * 1000);