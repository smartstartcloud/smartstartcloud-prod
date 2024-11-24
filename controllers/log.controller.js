import Log from './log.models.js';

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
