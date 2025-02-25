import Log from '../models/log.models.js';
import User from '../models/user.models.js';
import { extractToken } from '../utils/generateToken.js';

/**
 * Create a new log entry.
 * Expected body: { user, collection, action }
 */
export const createLog = async ({
  req,
  affectedID,
  collection,
  action,
  logMessage,
}) => {  
  try {
    const token = req.headers.cookie;
    const { userId } = extractToken(token);
    const user = await User.findById(userId, "firstName lastName userName");
    let message = "";

    if (collection === "Degree" && action === "create") {
      const { degreeName, degreeYear } = logMessage;
      message = `${user.firstName.toLowerCase()} created ${degreeName} Degree in ${degreeYear}`;
    } else {
      message = `${user.firstName} ${user.lastName} performed ${action} on ${collection}`;
    }

    const log = new Log({
      user: userId,
      userName: user.userName,
      affectedID,
      collectionName: collection,
      action,
      message,
    });
    await log.save();
    return log;
  } catch (error) {
    throw new Error(`Error creating log: ${error.message}`);
  }
};

export const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .sort({ timestamp: -1 })
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteLog = async (req, res) => {  
  try {
    const { id } = req.params; // Extract log ID from URL params
    const deletedLog = await Log.findByIdAndDelete(id);
    if (!deletedLog) {
      return res.status(404).json({ success: false, error: "Log not found" });
    }
    res.status(200).json({ success: true, data: deletedLog });
  } catch (error) {
    console.error("Error deleting log:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
