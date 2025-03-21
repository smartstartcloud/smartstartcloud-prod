import Log from '../models/log.models.js';
import User from '../models/user.models.js';
import { formatDateString } from '../utils/functions.js';
import { extractToken } from '../utils/generateToken.js';

/**
 * Create a new log entry.
 * Expected body: { user, collection, action }
 */
// export const createLog = async ({
//   req,
//   affectedID,
//   collection,
//   action,
//   logMessage,
// }) => {  
//   try {
//     const token = req.headers.cookie;
//     const { userId } = extractToken(token);
//     const user = await User.findById(userId, "firstName lastName userName");
//     let message = "";

//     if (collection === "Degree" && action === "create") {
//       const { degreeName, degreeYear } = logMessage;
//       message = `${user.firstName.toLowerCase()} created ${degreeName} Degree in ${degreeYear}`;
//     } else {
//       message = `${user.firstName} ${user.lastName} performed ${action} on ${collection}`;
//     }

//     const log = new Log({
//       user: userId,
//       userName: user.userName,
//       affectedID,
//       collectionName: collection,
//       action,
//       message,
//     });
//     await log.save();
//     return log;
//   } catch (error) {
//     throw new Error(`Error creating log: ${error.message}`);
//   }
// };

export const createLog = async ({
  req,
  affectedID,
  collection,
  action,
  actionToDisplay,
  logMessage,
  metadata = {},
  isFile = false,
  userID,
}) => {
  try {    
    const token = req.headers.cookie;
    let { userId } = extractToken(token, isFile);        
    if (isFile){
      userId = userID;
    }    
    const user = await User.findById(userId, "firstName lastName userName");    
    let message = "";

    switch (collection) {
      case "Degree":
        if (action === "create") {
          const { degreeName, degreeYear } = logMessage;
          message = `${user.firstName} added a new degree: ${degreeName} ${formatDateString(degreeYear)}.`;
        } else if (action === "update") {
          const { degreeName, degreeYear } = logMessage;
          message = `${user.firstName} updated the degree: ${degreeName} ${formatDateString(degreeYear)}.`;
        } else if (action === "delete") {
          const { degreeName, degreeYear } = logMessage;
          message = `${user.firstName} deleted the degree ${degreeName} ${formatDateString(degreeYear)}.`;
        }
        break;

      case "Assignment":
        if (action === "create") {
          const { assignmentName, assignmentID, studentID, moduleCode, degreeName, degreeYear} =
            logMessage;
          if (studentID && moduleCode) {
            message = `${user.firstName} created manual assignment: ${assignmentName} in ${degreeName} ${formatDateString(degreeYear)} for student ${studentID} in module ${moduleCode}.`;
          } else {
            message = `${user.firstName} created assignment: ${assignmentName} in ${degreeName} ${formatDateString(degreeYear)}.`;
          }
        } else if (action === "update") {          
          const { assignmentName, assignmentID } = logMessage;
          message = `${user.firstName} updated assignment: ${assignmentName}.`;
        } else if (action === "delete") {
          const { assignmentID, assignmentName } = logMessage;
          message = `${user.firstName} deleted assignment ${assignmentName}.`;
        }
        break;

      case "Payment":
        if (action === "updateDetails") {
          const { paymentID, studentName, paymentLogMessage } = logMessage;
          message = `${user.firstName} updated payment details of ${studentName}. ${paymentLogMessage}`;
        } else if (action === "update") {
          const { paymentID, paymentVerificationStatus, studentName } =
            logMessage;
          message = `${user.firstName} updated payment status of ${studentName} to "${paymentVerificationStatus}".`;
        } else if (action === "createPayment") {
          const { paymentID, studentName, paymentLogMessage } = logMessage;
          message = `${user.firstName} created payment details of ${studentName}. ${paymentLogMessage}`;
        }
        break;

      default:
        message = `${user.firstName} performed ${action} on ${collection}.`;
        break;
    }

    const log = new Log({
      user: userId,
      userName: user.userName,
      affectedID,
      collectionName: collection,
      action,
      actionToDisplay,
      message,
      metadata,
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
