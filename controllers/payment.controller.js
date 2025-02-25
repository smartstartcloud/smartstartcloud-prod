import Degree from "../models/degree.models.js";
import Module from "../models/module.models.js";
import User from "../models/user.models.js";
import ModuleStudentFinance from "../models/moduleStudentFinance.models.js";
import { sendNotification } from "./notification.controller.js";
import Student from "../models/student.models.js";
import { createLog } from "./log.controller.js";

export const addNewPayment = async (paymentRequiredInformation, userID) => {
  const { degreeID, assignmentID, moduleCode, studentID } =
    paymentRequiredInformation;
  // Find the module ID using the moduleCode
  const module = await Module.findOne({
    moduleCode,
  }).select("_id moduleName moduleCode");
  const degree = await Degree.findOne({
    degreeID
  }).select("degreeName degreeYear");;
  
  try {
    const newPayment = new ModuleStudentFinance({
      userID,
      studentID,
      moduleID: module._id,
      degreeID,
      degreeName: degree.degreeName,
      degreeYear: degree.degreeYear,
      moduleName: module.moduleName,
    });

    await newPayment.save();
  } catch (error) {
    console.log(error);
    return null;
  }
};

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

    res.status(200).json(finances[0] );
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
      addNewPayment(paymentRequiredInformation, userID);
      return res
       .status(200)
       .json({ error: "New Payment Created." });
    }
    const paymentLog = createPaymentLog(finances, updateDetails)
    
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

      // Construct and create a log entry for the payment update
      const logMessage = {
        paymentID: payment._id
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
      const logMessage = { paymentID: payment._id, paymentVerificationStatus };
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

const createPaymentLog = (previousData=null, newData, statusUpdate = false) => {

    let logString = ''    
    if (statusUpdate) {
      logString = `Payment STATUS UPDATED TO ${newData.paymentVerificationStatus}`;
    } else {
    if (
      previousData.paidAmount &&
      previousData.paymentMethod &&
      previousData.totalPaymentDue
    ) {
      logString = `A PAYMENT WAS MADE OF ${
        Number(newData.paidAmount) - Number(previousData.paidAmount)
      } GBP at ${newData.totalPaymentToDate}. Remaining ${
        newData.totalPaymentDue
      } GBP`;
    } else {
      logString = `A PAYMENT IS SET FOR ${newData.totalPaymentDue} GBP`;
    }
    }

    const date = new Date().toUTCString()
    return {date, logString}
    
}