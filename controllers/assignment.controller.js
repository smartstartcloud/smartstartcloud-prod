import Assignment from "../models/assignment.models.js";
import Module from "../models/module.models.js";
import ModuleAssignment from "../models/moduleAssignment.models.js";
import Order from "../models/order.models.js";
import Student from "../models/student.models.js";
import User from "../models/user.models.js";
import { extractToken } from "../utils/generateToken.js";
import { createLog } from "./log.controller.js";
import { addNewPayment } from "./payment.controller.js";
import { addNewStudentLog } from "./studentLog.controller.js";

// Creates or updates dynamic and main assignments in bulk
// - Updates existing assignments (main + dynamic) based on reference number
// - Creates new main + student assignments if not existing
// - Updates module-student-assignment relationship
export const newAssignmentDynamic = async (assignmentList, studentList, moduleCode, userDetails) => {          
    try {      
      const { userID, userName } = userDetails;  
      // Use Promise.all to save all Assignment concurrently
      const addedAssignmentIDs = await Promise.all(          
          assignmentList.map(async (assignmentData) => {
            
            const assignmentIDs = [];
            let currentAssignment = await Assignment.findOne({
              _id: assignmentData._id
            })
            if (currentAssignment){
              const updateAssignment = await Assignment.findByIdAndUpdate(
                { _id: assignmentData._id },
                {
                  assignmentName: assignmentData.assignmentName,
                  assignmentType: assignmentData.assignmentType,
                  assignmentDeadline: assignmentData.assignmentDeadline,
                  wordCount: assignmentData.wordCount,
                  referenceNumber: assignmentData.referenceNumber,
                  assignmentNature: "main",
                },
                { new: true }
              );
              assignmentIDs.push(updateAssignment._id); // Collect each saved ID
              
              let dynamicAssignmentList =
                await Assignment.find({
                  referenceNumber:assignmentData.referenceNumber, // Match by referenceNumber
                  assignmentNature: "dynamic", // Match only if assignmentNature is "dynamic"
                });
              await Promise.all(
                  dynamicAssignmentList.map(
                    async (assignment)=> {
                      const updateStudentAssignment =
                        await Assignment.findByIdAndUpdate(
                          { _id: assignment._id },
                          {
                            assignmentName: assignmentData.assignmentName,
                            assignmentType: assignmentData.assignmentType,
                            assignmentDeadline: assignmentData.assignmentDeadline,
                            wordCount: assignmentData.wordCount,
                            referenceNumber: assignmentData.referenceNumber,
                          },
                          { new: true }
                        );
                      assignmentIDs.push(updateStudentAssignment._id); // Collect each saved ID
                    }
                  )
              )              
              await Promise.all(
                studentList.map(async(student_id) => {
                  const student = await Student.findById(
                    student_id,
                    "studentID studentName"
                  );
                  await addNewStudentLog({
                    studentData: {
                      _id: student._id,
                      studentID: student.studentID,
                      studentName: student.studentName,
                    },
                    userID,
                    userName,
                    action: "updateAssignmentDynamic",
                    involvedData: {
                      type: "Assignment",
                      typeData: updateAssignment,
                    },
                  });
                  
                })
              )
              
            } else {
              // Store main assignments
              const newAssignmentMain = new Assignment({
                assignmentID: `main_${assignmentData.referenceNumber}`,
                assignmentName: assignmentData.assignmentName,
                assignmentType: assignmentData.assignmentType,
                assignmentDeadline: assignmentData.assignmentDeadline,
                wordCount: assignmentData.wordCount,
                assignmentProgress: "TBA",
                assignmentGrade: "",
                assignmentNature: "main",
                moduleCode: moduleCode,
                referenceNumber: assignmentData.referenceNumber,
              });
              const savedAssignmentMain = await newAssignmentMain.save();
              assignmentIDs.push(savedAssignmentMain._id); // Collect each saved ID

              // Store student basis assignment

              // Create a new Assignment instance
              for (let i = 0; i < studentList.length; i++) {
                const student = await Student.findById(
                  studentList[i],
                  "studentID studentName"
                );
                if (!student) {
                  console.error(`student with ID ${studentList[i]} not found.`);
                } else {
                  // Create a new Assignment instance
                  const newAssignment = new Assignment({
                    assignmentID: `${student.studentID}_${assignmentData.referenceNumber}`,
                    assignmentName: assignmentData.assignmentName,
                    assignmentType: assignmentData.assignmentType,
                    assignmentDeadline: assignmentData.assignmentDeadline,
                    wordCount: assignmentData.wordCount,
                    assignmentProgress: "TBA",
                    assignmentGrade: "",
                    assignmentNature: "dynamic",
                    moduleCode: moduleCode,
                    referenceNumber: assignmentData.referenceNumber,
                  });
                  // Save the assignment to the database and collect its ObjectID
                  const savedAssignment = await newAssignment.save();
                  assignmentIDs.push(savedAssignment._id); // Collect each saved ID
                  await updateModuleStudentAssignment(
                    moduleCode,
                    studentList[i],
                    savedAssignment._id
                  );
                  await addNewStudentLog({
                    studentData: {
                      _id: student._id,
                      studentID: student.studentID,
                      studentName: student.studentName,
                    },
                    userID,
                    userName,
                    action: "newAssignmentDynamic",
                    involvedData: { type: "Assignment", typeData: newAssignment },
                  });
                }
              }
            }
            
            return assignmentIDs;
          })
      );        
      return addedAssignmentIDs; // Return the array of added Assignment IDs
    } catch (error) {
      console.error("Error in newAssignment:", error);
      throw new Error("Internal Server Error");
      // res.status(500).json({ error: "Internal Server Error" });
    }
};

// Filters out 'main' assignments from a given assignment ID list
// - Returns only dynamic/manual assignment IDs
export const filterMainAssignments = async(assignments) => {
  // Fetch all assignments with their main assignment nature
  const results = await Promise.all(
    assignments.map(async (id) => {
      const mainAssignment = await Assignment.findOne({
        _id: id,
        assignmentNature: "main",
      });
      return { id, isMain: !!mainAssignment }; // Track whether it's a main assignment
    })
  );  

  // Filter out main assignments
  const filteredAssignments = results
    .filter((result) => !result.isMain) // Keep only non-main assignments
    .map((result) => result.id); // Extract the assignment IDs

  return filteredAssignments;
}

// Links assignments to students within a module context
// - Creates or updates ModuleAssignment records
// - Saves assignment metadata for navigation (used in frontend)
export const createNewModuleStudentAssignment = async (moduleID, studentList, assignmentList, parentLink) => {  
    for (const assignments of assignmentList) {
      const updatedAssignments = await filterMainAssignments(assignments);
      const sortedUpdatedAssignments = updatedAssignments.sort()
      
      for (let i = 0; i < studentList.length; i++) {        
        let existingModuleAssignment = await ModuleAssignment.findOne({
          studentID: studentList[i],
          moduleID: moduleID,
        });
        if (existingModuleAssignment) {
          // If it exists, add the new assignment ID to the assignments array if it's not already present
          if (!existingModuleAssignment.assignments.includes(sortedUpdatedAssignments[i])) {
            existingModuleAssignment.assignments.push(sortedUpdatedAssignments[i]);
            await existingModuleAssignment.save(); // Save the updated document
            // console.log("existingModuleAssignment", existingModuleAssignment);
          }
        } else {
          // If it does not exist, create a new ModuleAssignment document
          const newModuleAssignment = new ModuleAssignment({
            studentID: studentList[i],
            moduleID: moduleID,
            assignments: [sortedUpdatedAssignments[i]], // Initialize with the first assignment
          });
          await newModuleAssignment.save();

          // Update metadata with _id and save again
          const homeLink = parentLink;          
          newModuleAssignment.metadata = {
            goTo: homeLink,
            parentDataId: newModuleAssignment.studentID,
            dataId: newModuleAssignment.moduleID,
          };
          await newModuleAssignment.save();

          for (const assignment of newModuleAssignment.assignments){
            const tempAssignment = await Assignment.findById(assignment)
            if (tempAssignment){
              tempAssignment.metadata = {
                goTo: homeLink,
                grandParentDataId: newModuleAssignment.studentID,
                parentDataId: newModuleAssignment.moduleID,
                dataId: tempAssignment._id,
              };
              await tempAssignment.save();
            }
          }

          // console.log("newModuleAssignment", newModuleAssignment);
        }
      }
    }
}

// Updates or creates a ModuleAssignment for a student
// - Adds a specific assignment to the student's assignment list for the module
// - Avoids duplicates
export const updateModuleStudentAssignment = async (moduleCode, studentID, assignmentID) => {
  let moduleID = await Module.findOne({moduleCode: moduleCode}).select("_id");

  moduleID = moduleID?._id || null; // Safely extract the _id or set to null if no document is found
  if (moduleID){
    
    let existingModuleAssignment = await ModuleAssignment.findOne({
      studentID: studentID,
      moduleID: moduleID,
    });
    if (existingModuleAssignment) {
      // If it exists, add the new assignment ID to the assignments array if it's not already present
      if (!existingModuleAssignment.assignments.includes(assignmentID)) {
        existingModuleAssignment.assignments.push(assignmentID);
        await existingModuleAssignment.save(); // Save the updated document
        // console.log("existingModuleAssignment", existingModuleAssignment);
      }
    } else {
      // If it does not exist, create a new ModuleAssignment document
      const newModuleAssignment = new ModuleAssignment({
        studentID: studentID,
        moduleID: moduleID,
        assignments: [assignmentID], // Initialize with the first assignment
      });
      await newModuleAssignment.save();
      // console.log("newModuleAssignment", newModuleAssignment);
    }
  }

}

// Updates an assignment's fields using request body
// - Only updates fields that are provided
// - Logs the update action using createLog
export const updateAssignment = async (req, res) => {
  try {
    const testToken = req.headers.cookie;
    const { userId } = extractToken(testToken);
    const user = await User.findById(userId, "firstName lastName userName");
    const userDetails = { userID: userId, userName: "" };
    if (user) {
      userDetails.userName = user.userName;
    }

    const { assignmentID } = req.params;    
    const {
      moduleCode,
      orderID,
      assignmentName,
      assignmentType,
      assignmentProgress,
      assignmentDeadline,
      wordCount,
      assignmentGrade,
      assignmentFile,
      referenceNumber,
      assignmentNature,
      studentID: student_id, // aliasing here
    } = req.body;    
    
    // Update only the fields that are provided in the request body
    const updatedFields = {};

    if (orderID) updatedFields.orderID = orderID; // Only update if provided
    if (moduleCode) updatedFields.moduleCode = moduleCode;
    if (assignmentName) updatedFields.assignmentName = assignmentName;
    if (assignmentType) updatedFields.assignmentType = assignmentType;
    if (assignmentProgress) updatedFields.assignmentProgress = assignmentProgress;
    if (assignmentDeadline) updatedFields.assignmentDeadline = assignmentDeadline;
    if (wordCount) updatedFields.wordCount = wordCount;
    if (referenceNumber) updatedFields.referenceNumber = referenceNumber;
    if (assignmentGrade) updatedFields.assignmentGrade = assignmentGrade;
    if (assignmentFile) updatedFields.assignmentFile = assignmentFile;
    if (assignmentNature) updatedFields.assignmentNature = assignmentNature;

    // Find the specific assignment by its ID and update it
    const assignment = await Assignment.findByIdAndUpdate(
      {_id: assignmentID},
      { $set: updatedFields },
      { new: true } // Return the updated document
    );

    if (assignment) {
      // Ensure student exists
      const student = await Student.findOne({ _id: student_id }).select(
        "studentID studentName"
      );
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      // Optionally log creation here (currently commented out)
      if (student) {
        await addNewStudentLog({
          studentData: {
            _id: student._id,
            studentID: student.studentID,
            studentName: student.studentName,
          },
          userID: userDetails.userID,
          userName: userDetails.userName,
          action: "updateAssignmentManual",
          involvedData: { type: "Assignment", typeData: updatedFields },
        });
      }

      // Construct the log message
      const logMessage = {
        assignmentName: assignment.assignmentName,
        assignmentID: assignment.assignmentID,
      };
      // Create the log entry using the modified createLog helper
      await createLog({
        req,
        collection: "Assignment",
        action: "update",
        actionToDisplay: "Update Assignment",
        logMessage,
        affectedID: assignment._id,
      });
      res.status(200).json(assignment);
    } else {
      res
        .status(404)
        .json({ error: "No assignment found for the provided assignment ID" });
    }
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

async function findModuleIdByCode(moduleCode) {
  try {
    const module = await Module.findOne({ moduleCode: moduleCode }).select("_id");
    return module?._id;
  } catch (error) {
    console.error("Error finding module:", error);
  }
}

// ==================
// Manually creates an assignment for a single student
// - Used for ad hoc cases outside dynamic/main workflow
// ==================
export const newAssignmentManual = async (req, res) => {  
  try {
    const testToken = req.headers.cookie;
    const { userId } = extractToken(testToken);
    const user = await User.findById(userId, "firstName lastName userName");
    const userDetails = { userID: userId, userName: "" };
    if (user) {
      userDetails.userName = user.userName;
    }

    const {
      studentID,
      moduleCode,
      orderID,
      assignmentName,
      assignmentType,
      assignmentDeadline,
      wordCount,
      assignmentProgress,
      assignmentGrade,
      referenceNumber,
    } = req.body;

    // Get module ID from code
    const moduleID = await findModuleIdByCode(moduleCode);
    if (!moduleID) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Ensure student exists
    const student = await Student.findOne({ _id: studentID }).select("studentID studentName");
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find or create the ModuleAssignment document
    let moduleAssignmentData = await ModuleAssignment.findOne({ moduleID, studentID });
    if (!moduleAssignmentData) {
      moduleAssignmentData = new ModuleAssignment({
        studentID: student._id,
        moduleID,
        assignments: [],
      });
      await moduleAssignmentData.save();
    }

    // Create and save the new manual assignment
    const newAssignment = new Assignment({
      orderID: orderID === "" ? "N/A" : orderID,
      assignmentID: `${student.studentID}_${referenceNumber}`,
      assignmentName,
      assignmentType,
      assignmentDeadline,
      wordCount,
      assignmentProgress,
      assignmentGrade,
      assignmentFile: [], // Default to empty
      assignmentNature: "manual",
      moduleCode,
      referenceNumber,
    });
    const savedAssignment = await newAssignment.save();

    // Push assignment into ModuleAssignment doc
    const updateResult = await ModuleAssignment.findOneAndUpdate(
      { _id: moduleAssignmentData._id },
      { $push: { assignments: savedAssignment._id } },
      { new: true }
    );

    if (updateResult) {
      const logMessage = {
        assignmentName,
        assignmentID: savedAssignment.assignmentID,
        studentID,
        moduleCode,
      };

      // Optionally log creation here (currently commented out)
      if (student) {
        await addNewStudentLog({
          studentData: {
            _id: student._id,
            studentID: student.studentID,
            studentName: student.studentName,
          },
          userID: userDetails.userID,
          userName: userDetails.userName,
          action: "newAssignmentManual",
          involvedData: { type: "Assignment", typeData: newAssignment },
        });
      }

      res.status(200).json({ value: "Assignment added successfully" });
    } else {
      res.status(404).json({ error: "No document found with the given _id." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// ==================
// Deletes a single assignment
// - Also removes its reference from any ModuleAssignment
// - Logs the deletion
// ==================
export const deleteAssignment = async (req, res) => {
  const { assignmentID } = req.params;
  const testToken = req.headers.cookie;
  const { userId } = extractToken(testToken);
  const user = await User.findById(userId, "firstName lastName userName");
  const userDetails = { userID: userId, userName: "" };
  if (user) {
    userDetails.userName = user.userName;
  }

  try {
    // Delete the assignment by ID
    const deletedAssignment = await Assignment.findByIdAndDelete(assignmentID);
    if (!deletedAssignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // First, find the documents that are going to be updated
    const updatedAssignments = await ModuleAssignment.find(
      {assignments: assignmentID}, "studentID"
    );
    await Promise.all(
      updatedAssignments.map(async (assignmentData) => {
        const student = await Student.findById(
          assignmentData.studentID,
          "studentID studentName"
        );
        await addNewStudentLog({
          studentData: {
            _id: student._id,
            studentID: student.studentID,
            studentName: student.studentName,
          },
          userID: userDetails.userID,
          userName: userDetails.userName,
          action: "deleteAssignment",
          involvedData: {
            type: "Assignment",
            typeData: deletedAssignment,
          },
        });
      })
    );

    // Remove the deleted assignment from any ModuleAssignment lists
    await ModuleAssignment.updateMany(
      { assignments: assignmentID },
      { $pull: { assignments: assignmentID } }
    );

    // Log the delete operation
    const logMessage = {
      assignmentID: deletedAssignment.assignmentID,
      assignmentName: deletedAssignment.assignment,
    };
    await createLog({
      req,
      collection: "Assignment",
      action: "delete",
      logMessage,
    });

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


// ==================
// Links each assignment with an order
// - Sets `orderID` on Assignment
// - Updates Order to reflect assignment connection
// ==================
export const linkAssignmentOrderID = async (req, res) => {
  const { assignmentOrderPairs } = req.body;

  // Filter out incomplete entries
  const filteredAssignmentOrderPairs = assignmentOrderPairs.filter(item => item.assignmentID && item.orderID);

  try {
    const updatedAssignments = await Promise.all(
      filteredAssignmentOrderPairs.map(async ({ assignmentID, orderID }) => {
        // Update assignment with orderID
        const assignment = await Assignment.findByIdAndUpdate(
          {_id: assignmentID},
          { orderID },
          { new: true }
        );

        // Mark order as linked
        const order = await Order.findOneAndUpdate(
          { orderID },
          { linkStatus: true, assignmentConnected: assignmentID },
          { new: true }
        );
        return assignment;
      })
    );    
    res.status(200).json(updatedAssignments);
  } catch (error) {
    console.error("Error linking assignment and order ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


// ==================
// Duplicates 'main' assignments from modules for a new student
// - Creates dynamic copies linked to the student
// - Saves updated ModuleAssignment
// ==================
export const duplicateAssignmentFromMain = async (moduleList, studentInfo, userDetails) => {
  moduleList.map(async (moduleID) => {
    const module = await Module.findById({ _id: moduleID });
    const createdAssingmentList = [];

    // Loop over moduleAssignments to find 'main' assignments
    await Promise.all(
      module.moduleAssignments.map(async (list, index) => {
        const assignments = await Assignment.find({
          _id: { $in: list },
          assignmentNature: "main",
        });

        if (assignments.length > 0) {
          const original = assignments[0];

          // Create a dynamic assignment copy for the student
          const newAssignment = new Assignment({
            assignmentID: `${studentInfo.studentID}_${original.referenceNumber}`,
            assignmentName: original.assignmentName,
            assignmentType: original.assignmentType,
            assignmentDeadline: original.assignmentDeadline,
            wordCount: original.wordCount,
            assignmentProgress: "TBA",
            assignmentGrade: "",
            assignmentNature: "dynamic",
            moduleCode: original.moduleCode,
            referenceNumber: original.referenceNumber,
          });

          // Optionally log creation here (currently commented out)
          if (studentInfo) {
            await addNewStudentLog({
              studentData: {
                _id: studentInfo._id,
                studentID: studentInfo.studentID,
                studentName: studentInfo.studentName,
              },
              userID: userDetails.userID,
              userName: userDetails.userName,
              action: "newAssignmentDynamic",
              involvedData: { type: "Assignment", typeData: newAssignment },
            });
          }

          const savedAssignment = await newAssignment.save();
          createdAssingmentList.push(savedAssignment._id);

          // Also push to module-level assignment list
          module.moduleAssignments[index].push(savedAssignment._id);
        }
      })
    );

    // Create ModuleAssignment document for the student
    const newModuleAssignment = new ModuleAssignment({
      studentID: studentInfo._id,
      moduleID: moduleID,
      assignments: createdAssingmentList,
    });

    await newModuleAssignment.save();
    await module.save();
  });
}

