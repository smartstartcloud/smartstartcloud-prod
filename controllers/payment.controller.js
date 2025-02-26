import Degree from "../models/degree.models.js";
import Module from "../models/module.models.js";
import User from "../models/user.models.js";
import ModuleStudentFinance from "../models/moduleStudentFinance.models.js";
import { sendNotification } from "./notification.controller.js";
import Student from "../models/student.models.js";
import { createLog } from "./log.controller.js";
import ModuleAssignment from "../models/moduleAssignment.models.js";

export const addNewPayment = async (paymentRequiredInformation, userID, paymentDetails) => {
  const { degreeID, assignmentID, moduleCode, studentID } =
    paymentRequiredInformation;
  // Find the module ID using the moduleCode
  const module = await Module.findOne({
    moduleCode,
  }).select("_id moduleName moduleCode");
  const degree = await Degree.findOne({
    degreeID
  }).select("degreeName degreeYear");
  const newDetails = {};
  
  if (paymentDetails.modulePrice) newDetails.modulePrice = paymentDetails.modulePrice;
  if (paymentDetails.totalPaymentDue) newDetails.totalPaymentDue = paymentDetails.totalPaymentDue;
  if (paymentDetails.totalPaymentToDate) newDetails.totalPaymentToDate = paymentDetails.totalPaymentToDate;
  if (paymentDetails.paymentMethod) newDetails.paymentMethod = paymentDetails.paymentMethod;
  if (paymentDetails.paymentStatus) newDetails.paymentStatus = paymentDetails.paymentStatus;
  if (paymentDetails.paidAmount) newDetails.paidAmount = paymentDetails.paidAmount;
  if (paymentDetails.otherPaymentMethod) newDetails.otherPaymentMethod = paymentDetails.otherPaymentMethod;
  if (paymentDetails.bankPaymentMethod) newDetails.bankPaymentMethod = paymentDetails.bankPaymentMethod;
  if (paymentDetails.cashPaymentMethod) newDetails.cashPaymentMethod = paymentDetails.cashPaymentMethod;
  if (paymentDetails.referredPaymentMethod) newDetails.referredPaymentMethod = paymentDetails.referredPaymentMethod;
  if (paymentDetails.paymentVerificationStatus) {
    newDetails.paymentVerificationStatus =
      paymentDetails.paymentVerificationStatus === "approved"
        ? "awaiting approval"
        : paymentDetails.paymentVerificationStatus;
  }
  if (paymentDetails.userID) newDetails.userID = paymentDetails.userID;
  const paymentLog = createPaymentLog({
    newData: newDetails,
    isNew: true,
  });
  
  try {
    const newPayment = new ModuleStudentFinance({
      userID,
      studentID,
      moduleID: module._id,
      degreeID,
      degreeName: degree.degreeName,
      degreeYear: degree.degreeYear,
      moduleName: module.moduleName,
      paymentLog: [paymentLog], // Push paymentLog directly into the document
      ...newDetails, // Merge newDetails into the model
    });
    

    await newPayment.save();
    const moduleAssignment = await ModuleAssignment.findOne({
      studentID: studentID,
      moduleID: module._id,
    })
    if (moduleAssignment) {
      moduleAssignment.modulePayment = newPayment._id;
      await moduleAssignment.save();
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updatePaymentDetails = async (req, res) => {
  const {
    totalPaymentDue,
    totalPaymentToDate,
    paymentMethod,
    paymentAmount,
    paymentStatus,
    paidAmount,
    otherPaymentMethod,
    bankPaymentMethod,
    cashPaymentMethod,
    referredPaymentMethod,
    paymentRequiredInformation,
    paymentVerificationStatus,
    userID
  } = req.body;
  try {
    const updateDetails = {};
    if (paymentAmount) updateDetails.modulePrice = paymentAmount;
    if (totalPaymentDue) updateDetails.totalPaymentDue = totalPaymentDue;
    if (totalPaymentToDate) updateDetails.totalPaymentToDate = totalPaymentToDate;
    if (paymentMethod) updateDetails.paymentMethod = paymentMethod;
    if (paymentStatus) updateDetails.paymentStatus = paymentStatus
    if (paidAmount) updateDetails.paidAmount = paidAmount;
    if (otherPaymentMethod) updateDetails.otherPaymentMethod = otherPaymentMethod;
    if (bankPaymentMethod) updateDetails.bankPaymentMethod = bankPaymentMethod;
    if (cashPaymentMethod) updateDetails.cashPaymentMethod = cashPaymentMethod;
    if (referredPaymentMethod) updateDetails.referredPaymentMethod = referredPaymentMethod;
    if (paymentVerificationStatus) {
      updateDetails.paymentVerificationStatus =
        paymentVerificationStatus === "approved"
          ? "awaiting approval"
          : paymentVerificationStatus;
    }    
    if (userID) updateDetails.userID = userID;
    
    // Find the module ID using the moduleCode
    const module = await Module.findOne({
      moduleCode: paymentRequiredInformation.moduleCode,
    });
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Find all records in ModuleStudentFinance where studentID and moduleID match
    const finances = await ModuleStudentFinance.findOne({
      studentID: paymentRequiredInformation.studentID,
      moduleID: module._id,
    });
    if (!finances) {
      addNewPayment(paymentRequiredInformation, userID, updateDetails);
      return res
       .status(200)
       .json({ message: "New Payment Created." });
    }
    const paymentLog = createPaymentLog({previousData: finances, newData: updateDetails})
    
    // Find the specific assignment by its ID and update it
    const payment = await ModuleStudentFinance.findByIdAndUpdate(
      finances._id,
      { $set: updateDetails, $push: { paymentLog } },
      { new: true } // Return the updated document
    );
    if (payment) {
      await sendNotification(
        req,
        ["admin"],
        "alert",
        `Payment Requires Approval for ${payment.degreeName} ${payment.degreeYear} ${payment.moduleName}. The paid amount is ${payment.paidAmount}.`,
        { goTo: `/paymentApprovals`, paymentId: payment._id }
      );
      const student = await Student.findById(payment.studentID);
      
      // Construct and create a log entry for the payment update
      const logMessage = {
        paymentID: payment._id,
        studentName: student.studentName,
        paymentLogMessage : paymentLog
      } ;
      await createLog({
        req,
        collection: "Payment",
        action: "updateDetails",
        logMessage,
        affectedID: payment._id,
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
  const {
    paymentVerificationStatus,
    id
  } = req.body;
  
  try {
    const updateDetails = {};
    if (paymentVerificationStatus)      
      updateDetails.paymentVerificationStatus = paymentVerificationStatus;

    const paymentLog = createPaymentLog(updateDetails, true);   

    // Find the specific assignment by its ID and update it
    const payment = await ModuleStudentFinance.findByIdAndUpdate(
      id,
      { $set: updateDetails, $push: { paymentLog } },
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
          goTo: `/task/${payment.degreeYear}/${payment.degreeID}`,
          dataId: student.studentID,
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
        logMessage,
        affectedID: payment._id,
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

const createPaymentLog = ({previousData=null, newData, statusUpdate=false, isNew=false}) => {    
    let logString = ''
    if (isNew) {
      logString = `A payment of £${newData.totalPaymentDue} has been scheduled.`;
    }
    if (statusUpdate) {
      logString = `Payment status updated to ${newData.paymentVerificationStatus}.`;
    } else {
      if (previousData?.paidAmount && previousData?.totalPaymentDue) {
        logString = `A payment of £${
          Number(newData.paidAmount) - Number(previousData.paidAmount)
        } has been made on ${newData.totalPaymentToDate}. Remaining balance: £${newData.totalPaymentDue}.`;
      }
    }

    const date = new Date().toUTCString()
    return {date, logString}
    
}

export const getPaymentDetails = async (req, res) => {
  const { assignmentID, moduleCode, studentID } = req.body;
  try {
    // Find the module ID using the moduleCode
    const module = await Module.findOne({ moduleCode });
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Find all records in ModuleStudentFinance where studentID and moduleID match
    const finances = await ModuleStudentFinance.find({
      studentID,
      moduleID: module._id,
    });

    res.status(200).json(finances[0]);
  } catch (error) {
    console.error("Error fetching finance data:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

export const getPaymentDetailsAll = async (req, res) => {
  try {
    // Find all records in ModuleStudentFinance where studentID and moduleID match
    // 1️⃣ Fetch finance data with student details
    const finances = await ModuleStudentFinance.find()
      .populate("studentID", "studentName studentID")
      .lean(); // Convert Mongoose documents to plain JS objects

    // 2️⃣ Extract unique userIDs
    const userIds = finances.map((finance) => finance.userID);

    // 3️⃣ Fetch user details from the separate `userDB`
    const users = await User.find({ _id: { $in: userIds } })
      .select("userName")
      .lean();

    // 4️⃣ Create a map for quick lookup
    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = user;
      return map;
    }, {});

    // 5️⃣ Attach user details to the finance records
    const enrichedFinances = finances.map((finance) => ({
      ...finance,
      user: userMap[finance.userID?.toString()] || null, // Attach user details or null if not found
    }));

    res.status(200).json(enrichedFinances);
  } catch (error) {
    console.error("Error fetching finance data:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};