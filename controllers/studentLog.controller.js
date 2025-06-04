import Student from "../models/student.models.js";
import StudentLog from "../models/studentLog.model.js";

export const addNewStudentLog = async ({
  studentData,
  userID,
  userName,
  action,
  involvedData = {},
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
      actionToDisplay: actionTypes[action],
      message: actionTypes[action],
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
    const logs = await StudentLog.find({ affectedStudentID: student._id })

    res.status(200).json({ studentID, logs });
  } catch (error) {
    console.error("Error fetching student logs:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};


const actionTypes = {
  newStudentDynamic: "Student Created Dynamically.",
  updateStudentDynamic: "Student is Updated Dynamically",
  newStudentManual: "Student Created Manually.",
  updateStudentManual: "Student is Updated Manually",
  newAssignmentDynamic: "Assignment Created Dynamically.",
  newAssignmentManual: "Assignment Created Manually.",
  updateAssignmentDynamic: "Assignment Updated Dynamically.",
  updateAssignmentManual: "Assignment Updated Manually.",
  deleteAssignment: "Assignment Deleted Successfully.",
};
