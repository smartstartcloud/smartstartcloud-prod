import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";
import { extractToken } from "../utils/generateToken.js";

export const sendNotification = async (req, role, type, message, metadata={}) => {
    const testToken = req.headers.authorization;
    const { userId } = extractToken(testToken);
    // Find users with the given role
    const users = await User.find({ role }).select("_id");

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
        recipients: { $in: [userId] },
      }) // Check if userId exists in the array
        .sort({ createdAt: -1 }) // Latest notifications first
        .limit(10);

      res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}