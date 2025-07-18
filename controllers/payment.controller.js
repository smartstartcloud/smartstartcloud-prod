import Degree from "../models/degree.models.js";
import Module from "../models/module.models.js";
import User from "../models/user.models.js";
import ModuleStudentFinance from "../models/moduleStudentFinance.models.js";
import { sendNotification } from "./notification.controller.js";
import Student from "../models/student.models.js";
import { createLog } from "./log.controller.js";
import ModuleAssignment from "../models/moduleAssignment.models.js";
import {
  enumToString,
  formatDate,
  formatDateShort,
} from "../utils/functions.js";
import File from "../models/files.model.js";
import { addNewStudentLog } from "./studentLog.controller.js";
import { extractToken } from "../utils/generateToken.js";

export const addNewPayment = async (
  req,
  res,
  paymentRequiredInformation,
  userID,
  paymentDetails,
  userDetails
) => {
  try {
    const { degreeID, moduleCode, studentID } = paymentRequiredInformation;
    const module = await Module.findOne({ moduleCode }).select(
      "_id moduleName moduleCode"
    );
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    const degree = await Degree.findOne({ degreeID }).select(
      "degreeName degreeYear"
    );
    if (!degree) {
      return res.status(404).json({ error: "Degree not found" });
    }

    const student = await Student.findById(studentID);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const newDetails = {
      ...paymentDetails,
      paymentVerificationStatus:
        paymentDetails.paymentVerificationStatus === "approved"
          ? "awaiting approval"
          : paymentDetails.paymentVerificationStatus,
    };

    const paymentLog = createPaymentLog({ newData: newDetails, isNew: true });
    const homeLink = `/task/${degree.degreeYear}/${degreeID}`;
    const dataId = student.studentID;

    const newPayment = new ModuleStudentFinance({
      userID,
      studentID,
      moduleID: module._id,
      degreeID,
      degreeName: degree.degreeName,
      degreeYear: degree.degreeYear,
      moduleName: module.moduleName,
      paymentLog: [paymentLog],
      ...newDetails,
      metadata: { goTo: homeLink, dataId },
    });

    const moduleAssignment = await ModuleAssignment.findOne({
      studentID,
      moduleID: module._id,
    });

    if (!moduleAssignment) {
      return res.status(404).json({ error: "No Assignment Module Created" });
    }

    if (!Array.isArray(moduleAssignment.modulePayment)) {
      moduleAssignment.modulePayment = [];
    }

    moduleAssignment.modulePayment.push(newPayment._id);

    await moduleAssignment.save();

    // Fire off post-commit side-effects (these shouldn't be in the transaction)
    await sendNotification(
      req,
      ["admin", "finance"],
      "alert",
      `Payment Requires Approval for ${newPayment.degreeName} ${newPayment.degreeYear} ${newPayment.moduleName}. The paid amount is ${newPayment.paidAmount}.`,
      { goTo: `/paymentApprovals`, paymentId: newPayment._id }
    );

    const logMessage = {
      paymentID: newPayment._id,
      studentName: student.studentName,
      paymentLogMessage: paymentLog.logString,
    };

    await newPayment.save();

    await addNewStudentLog({
      studentData: {
        _id: student._id,
        studentID: student.studentID,
        studentName: student.studentName,
      },
      userID: userDetails.userID,
      userName: userDetails.userName,
      action: "newPayment",
      involvedData: {
        type: "Payment",
        typeData: newPayment,
      },
    });

    await createLog({
      req,
      collection: "Payment",
      action: "createPayment",
      actionToDisplay: "Create Payment",
      logMessage,
      affectedID: newPayment._id,
      metadata: newPayment.metadata,
    });
    res.status(200).json(newPayment);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      // stack: error.stack, // optional, only include in development
    });
  }
};

export const updatePaymentDetails = async (req, res) => {
  const {
    _id,
    paymentPlan,
    note,
    totalPaymentDue,
    totalPaymentToDate,
    paymentMethod,
    paymentAmount,
    paymentStatus,
    paidAmount,
    otherPaymentMethod,
    bankPaymentMethod,
    bankPayeeName,
    cashPaymentMethod,
    referredPaymentMethod,
    paymentRequiredInformation, //Contains {assignmentID, degreeID, moduleCode, moduleId, studentID(_id)}
    paymentVerificationStatus,
    userID,
  } = req.body;

  const testToken = req.headers.cookie;
  const { userId } = extractToken(testToken);
  const user = await User.findById(userId, "firstName lastName userName");
  const userDetails = { userID: userId, userName: "" };
  if (user) {
    userDetails.userName = user.userName;
  }

  try {
    const isNewPayment = req.query.new === "true";

    const updateDetails = {};
    if (paymentPlan) updateDetails.paymentPlan = paymentPlan;
    if (note) updateDetails.note = note;
    if (paymentAmount) updateDetails.modulePrice = paymentAmount;
    if (totalPaymentDue) updateDetails.totalPaymentDue = totalPaymentDue;
    if (totalPaymentToDate)
      updateDetails.totalPaymentToDate = totalPaymentToDate;
    if (paymentMethod) updateDetails.paymentMethod = paymentMethod;
    if (paymentStatus) updateDetails.paymentStatus = paymentStatus;
    if (paidAmount) updateDetails.paidAmount = paidAmount;
    if (otherPaymentMethod)
      updateDetails.otherPaymentMethod = otherPaymentMethod;
    if (bankPaymentMethod) updateDetails.bankPaymentMethod = bankPaymentMethod;
    if (bankPayeeName) updateDetails.bankPayeeName = bankPayeeName;
    if (cashPaymentMethod) updateDetails.cashPaymentMethod = cashPaymentMethod;
    if (referredPaymentMethod)
      updateDetails.referredPaymentMethod = referredPaymentMethod;
    if (paymentVerificationStatus) {
      updateDetails.paymentVerificationStatus =
        paymentVerificationStatus === "approved" ||
        paymentVerificationStatus === "rejected"
          ? "awaiting approval"
          : paymentVerificationStatus;
    }
    if (userID) updateDetails.userID = userID;

    // Find the module ID using the moduleCode
    const module = await Module.findById({
      _id: paymentRequiredInformation.moduleId,
    });
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Find the module ID using the moduleCode
    const moduleAssignment = await ModuleAssignment.findOne({
      moduleID: paymentRequiredInformation.moduleId,
      studentID: paymentRequiredInformation.studentID,
    }).select("_id");
    if (!moduleAssignment) {
      return res.status(404).json({ error: "Module Assignment not found" });
    }

    updateDetails.moduleAssignmentID = moduleAssignment._id;
    if (isNewPayment && !_id) {
      return addNewPayment(
        req,
        res,
        paymentRequiredInformation,
        userID,
        updateDetails,
        userDetails
      );
    }

    if (!_id){
      return res
        .status(404)
        .json({ error: "This is a new Entry. Cannot Update." });
    }

    // Find all records in ModuleStudentFinance where studentID and moduleID match
    const finances = await ModuleStudentFinance.findById({ _id });
    const paymentLog = createPaymentLog({
      previousData: finances,
      newData: updateDetails,
    });

    // Find the specific assignment by its ID and update it
    const payment = await ModuleStudentFinance.findByIdAndUpdate(
      finances._id,
      { $set: updateDetails, $push: { paymentLog } },
      { new: true } // Return the updated document
    );
    if (payment) {
      await sendNotification(
        req,
        ["admin", "finance"],
        "alert",
        `Payment Requires Approval for ${payment.degreeName} ${payment.degreeYear} ${payment.moduleName}. The paid amount is ${payment.paidAmount}.`,
        { goTo: `/paymentApprovals`, paymentId: payment._id }
      );
      const student = await Student.findById(payment.studentID);

      await addNewStudentLog({
        studentData: {
          _id: student._id,
          studentID: student.studentID,
          studentName: student.studentName,
        },
        userID: userDetails.userID,
        userName: userDetails.userName,
        action: "updatePayment",
        involvedData: {
          type: "Payment",
          typeData: payment,
        },
      });

      // Construct and create a log entry for the payment update
      const logMessage = {
        paymentID: payment._id,
        studentName: student.studentName,
        paymentLogMessage: paymentLog.logString,
      };
      await createLog({
        req,
        collection: "Payment",
        action: "updateDetails",
        actionToDisplay: "Update Payment",
        logMessage,
        affectedID: payment._id,
        metadata: payment.metadata,
      });

      res.status(200).json(payment);
    } else {
      res
        .status(404)
        .json({ error: "No payment found for the provided payment ID" });
    }
  } catch (error) {
    console.error("Error sending finance data:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  const { paymentVerificationStatus, approvalNote, approvedBy, id } = req.body;
  try {
    const updateDetails = {};
    const paymentLogDetails = {};
    if (paymentVerificationStatus) {
      updateDetails.paymentVerificationStatus = paymentVerificationStatus;
      paymentLogDetails.paymentVerificationStatus = paymentVerificationStatus;
    }

    let approvalNoteLog = null;
    approvalNoteLog = {
      date: new Date().toUTCString(),
      approvalStatus: paymentVerificationStatus,
      approvalNote,
      approvedBy,
    };

    paymentLogDetails.notes = approvalNote;
    paymentLogDetails.noteBy = approvedBy;

    const paymentLog = createPaymentLog({
      newData: paymentLogDetails,
      statusUpdate: true,
    });

    // Construct the update object dynamically
    const updateFields = {
      $set: updateDetails,
      $push: { paymentLog: paymentLog }, // Always push paymentLog
    };

    // Only add approvalNoteLog if it's not null
    if (approvalNoteLog) {
      updateFields.$push.approvalNoteLog = approvalNoteLog;
    }
    // Find the specific assignment by its ID and update it
    const payment = await ModuleStudentFinance.findByIdAndUpdate(
      id,
      updateFields,
      { new: true } // Return the updated document
    );
    if (payment) {
      const student = await Student.findById(payment.studentID);
      sendNotification(
        req,
        ["agent", "admin"],
        "alert",
        `Payment for Student : ${student.studentID} and Degree ${payment.degreeName} ${payment.degreeYear} ${payment.moduleName} is ${paymentVerificationStatus}. The paid amount is ${payment.paidAmount}.`,
        {
          goTo: payment.metadata.goTo,
          dataId: payment.metadata.dataId,
        }
      );
      // Log the payment status update action
      const logMessage = {
        paymentID: payment._id,
        paymentVerificationStatus,
        studentName: student.studentName,
      };
      await createLog({
        req,
        collection: "Payment",
        action: "update",
        actionToDisplay: "Payment Status Update",
        logMessage,
        affectedID: payment._id,
        metadata: payment.metadata,
      });

      res
        .status(200)
        .json({ data: payment, message: "PaymentStatus Updated Successfully" });
    } else {
      res
        .status(404)
        .json({ error: "No payment found for the provided payment ID" });
    }
  } catch (error) {
    console.error("Error sending finance data:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const createPaymentLog = ({
  previousData = null,
  newData,
  statusUpdate = false,
  isNew = false,
}) => {
  let logString = "";

  if (statusUpdate) {
    const statusNotes = newData.notes == "" ? "No notes were" : newData.notes;
    const statusBy = newData.noteBy;
    logString = `Payment status updated to "${newData.paymentVerificationStatus}". "${statusNotes}" made by "${statusBy}"`;
  } else {
    if (isNew) {
      logString = `A payment is due for ${
        newData.totalPaymentDue
      } GBP. ${enumToString("paymentPlan", newData.paymentPlan)}. ${
        newData.note
      }`;
    } else {
      logString = `A payment of ${
        newData.paidAmount
      } GBP was made. At ${formatDateShort(newData.totalPaymentToDate)}`;
    }
  }

  const date = new Date().toUTCString();
  return { date, logString };
};

export const deletePaymentDetails = async (req, res) => {
  try {
    const { paymentID } = req.params;
    const testToken = req.headers.cookie;
    const { userId } = extractToken(testToken);
    const user = await User.findById(userId, "firstName lastName userName");
    const userDetails = { userID: userId, userName: "" };
    if (user) {
      userDetails.userName = user.userName;
    }
    console.log("Attempting to delete payment:", paymentID);
    const financeEntry = await ModuleStudentFinance.findById(
      paymentID,
      "studentID"
    );    
    if (!financeEntry) {
      throw new Error("Payment entry not found");
    }

    const student = await Student.findById(financeEntry.studentID);

    const deleted = await ModuleStudentFinance.findByIdAndDelete(paymentID);
    
    if (!deleted) {      
      return res.status(404).json({ message: "Payment not found" });
    }    
    const newLog = await addNewStudentLog({
      studentData: {
        _id: student._id,
        studentID: student.studentID,
        studentName: student.studentName,
      },
      userID: userDetails.userID,
      userName: userDetails.userName,
      action: "deletePayment",
      involvedData: {
        type: "Payment",
        typeData: deleted,
      },
    });

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) { 
    console.log(error);
       
    res.status(500).json({ message: "Error deleting payment"});
  }
};

export const getPaymentDetails = async (req, res) => {
  const { assignmentID, moduleCode, studentID } = req.body;
  try {
    // Find the module ID using the moduleCode
    const moduleID = await Module.findOne({ moduleCode }).select("_id");

    if (!moduleID) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Find all records in ModuleStudentFinance where studentID and moduleID match
    const finances = await ModuleStudentFinance.find({
      studentID,
      moduleID,
    });    
    res.status(200).json(finances);
  } catch (error) {
    console.error("Error fetching finance data:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

export const getPaymentDetailsWithDegree = async (req, res) => {
  const { degreeID, studentID } = req.params;  
  try {

    // Find all records in ModuleStudentFinance where studentID and moduleID match
    const finances = await ModuleStudentFinance.find({
      studentID,
      degreeID,
      paymentVerificationStatus: "approved",
    }).select("paidAmount");    
    res.status(200).json(finances);
  } catch (error) {
    console.error("Error fetching finance data:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const getPaymentDetailsAll = async (req, res) => {
  try {
    const { verificationStatus } = req.query; // Catch the query parameter
    let query = {}; // Default to fetching all records

    if (verificationStatus && verificationStatus !== "all") {
      query.paymentVerificationStatus = verificationStatus;
    }

    // Ensure paymentToDate is not empty, not null, and not blank
    query.totalPaymentToDate = { $ne: null, $ne: "", $exists: true };

    // Find all records in ModuleStudentFinance where studentID and moduleID match
    // 1️⃣ Fetch finance data with student details
    const finances = await ModuleStudentFinance.find(query)
      .populate("studentID", "studentName studentID")
      .lean(); // Convert Mongoose documents to plain JS objects

    // 2️⃣ Extract unique userIDs
    const userIds = finances.map((finance) => finance.userID);
    const fileIds = finances.flatMap((finance) => finance.fileList || []);

    // 3️⃣ Fetch user details from the separate `userDB`
    const users = await User.find({ _id: { $in: userIds } })
      .select("userName")
      .lean();

    const files = await File.find({ _id: { $in: fileIds } })
      .select("fileName fileType fileUrl updatedAt")
      .lean();

    // 4️⃣ Create a map for quick lookup
    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = user;
      return map;
    }, {});

    const fileMap = files.reduce((map, file) => {
      map[file._id.toString()] = file;
      return map;
    }, {});

    // 5️⃣ Attach user details to the finance records
    const enrichedFinances = finances.map((finance) => ({
      ...finance,
      user: userMap[finance.userID?.toString()] || null, // Attach user details or null if not found
      files: (finance.fileList || []).map(
        (fileId) => fileMap[fileId.toString()] || null
      ), // Attach file details or null if not found
    }));

    res.status(200).json(enrichedFinances);
  } catch (error) {
    console.error("Error fetching finance data:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
