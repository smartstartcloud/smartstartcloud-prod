import Log from '../models/log.models.js';
import User from '../models/user.models.js';

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
    const token = req.headers.authorization;
    const { userId } = extractToken(token);
    const user = await User.findById(userId, "firstName lastName");
    const suffixMessage = `Made By ${user.firstName} ${user.lastName}.`;
    const message = `${logMessage} ${suffixMessage}`;

    const log = new Log({
      user: userId,
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

export const getLogs = async (req, res) => {
  try {
    const { userId, action, startDate, endDate } = req.query;

    const query = {};

    if (userId) query.user = userId;
    if (action) query.action = action;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await Log.find(query).populate('user', 'email firstName lastName');
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
