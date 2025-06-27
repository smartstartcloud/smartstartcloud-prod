import Student from "../models/student.models.js";
import StudentLog from "../models/studentLog.model.js";

export const addNewStudentLog = async ({
  studentData,
  userID,
  userName,
  action,
  involvedData = {type: "", typeData: ""},
  metadata = {},
}) => {
  try {
    // Validate input
    if (!studentData?._id || !studentData?.studentID) {
      throw new Error("Invalid student data provided.");
    }
    if (!userID || !userName || !actionTypes[action]) {
      throw new Error("Missing or invalid logging parameters.");
    }

    // Create new log entry
    const newLog = new StudentLog({
      userID,
      userName,
      affectedStudentID: studentData._id,
      affectedStudentDisplayID: studentData.studentID,
      action,
      type: actionTypes[action].type,
      message: actionTypes[action].message,
      involvedData,
      metadata,
    });

    // Save the log
    await newLog.save();

    // Push the log into Student model
    await Student.findByIdAndUpdate(
      studentData._id,
      { $push: { studentLog: newLog._id } },
      { new: true }
    );

    console.log(
      `Student log ${newLog.logID} created and added to student ${studentData.studentID}`
    );
    return newLog;
  } catch (error) {    
    console.error("Failed to create and attach student log:", error.message);
    throw error;
  }
};

export const getLogsByStudentID = async (req, res) => {
  try {
    const { studentID } = req.params;

    if (!studentID) {
      return res.status(400).json({ message: "studentID is required." });
    }

    // Find the student document first
    const student = await Student.findOne({ studentID });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Get logs associated with this student ObjectId
    const logs = await StudentLog.find({ affectedStudentID: student._id }).sort(
      { timestamp: -1 }
    );

    res.status(200).json({ studentID, logs });
  } catch (error) {
    console.error("Error fetching student logs:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};


const actionTypes = {
  newStudentDynamic: {
    message: "Student Created Dynamically.",
    type: "student",
  },
  updateStudentDynamic: {
    message: "Student is Updated Dynamically",
    type: "student",
  },
  newStudentManual: { message: "Student Created Manually.", type: "student" },
  updateStudentManual: {
    message: "Student is Updated Manually",
    type: "student",
  },

  newAssignmentDynamic: {
    message: "Assignment Created Dynamically.",
    type: "assignment",
  },
  newAssignmentManual: {
    message: "Assignment Created Manually.",
    type: "assignment",
  },
  updateAssignmentDynamic: {
    message: "Assignment Updated Dynamically.",
    type: "assignment",
  },
  updateAssignmentManual: {
    message: "Assignment Updated Manually.",
    type: "assignment",
  },
  deleteAssignment: {
    message: "Assignment Deleted Successfully.",
    type: "assignment",
  },

  newPayment: { message: "New Payment Added.", type: "payment" },
  updatePayment: { message: "Payment Updated", type: "payment" },
  deletePayment: { message: "Delete Payment", type: "payment" },

  fileUpload: {
    message: "File Uploaded.",
    type: "file",
  },
  fileDownload: {
    message: "File Downloaded.",
    type: "file",
  },
  fileDelete: {
    message: "File Deleted.",
    type: "file",
  },
};
