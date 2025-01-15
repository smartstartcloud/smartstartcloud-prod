import Log from './log.models.js';

export const logAction = (action, details = {}) => async (req, res, next) => {
  try {
    const user = req.user; // Extracted from your JWT authentication middleware
    if (!user) {
      throw new Error('User is not authenticated.');
    }

    // Create a log entry
    await Log.create({
      action,
      user: user.id, // Assuming `user` is attached to `req` after authentication
      details,
    });

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error('Failed to log action:', error);
    next(); // Allow the request to continue even if logging fails
  }
};
