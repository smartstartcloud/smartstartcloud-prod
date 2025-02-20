import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";

export const sendNotification = async (role, senderId, type, message) => {
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
        sender: senderId,
        type,
        message,
    });

    await notification.save();
    console.log(`Notification sent to ${users.length} users with role: ${role}`);
}

export const fetchNewNotification = (req, res) => {

}