import Assignment from "../models/assignment.models.js";
import Module from "../models/module.models.js";
import ModuleAssignment from "../models/moduleAssignment.models.js";

// Function to create a new assignment and update relevant records
export const newAssignmentDynamic = async (assignmentList, studentList, moduleCode) => {        
    try {          
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
                  dynamicAssignmentList.map(async (assignment)=> {
                    const updateStudentAssignment =
                      await Assignment.findByIdAndUpdate(
                        { _id: assignment._id },
                        {
                          assignmentName: assignmentData.assignmentName,
                          assignmentType: assignmentData.assignmentType,
                          assignmentDeadline: assignmentData.assignmentDeadline,
                          referenceNumber: assignmentData.referenceNumber,
                        },
                        { new: true }
                      );
                    assignmentIDs.push(updateStudentAssignment._id); // Collect each saved ID
                  }
                )
              )
                
              } else {
                // Store main assignments
                const newAssignmentMain = new Assignment({
                  assignmentName: assignmentData.assignmentName,
                  assignmentType: assignmentData.assignmentType,
                  assignmentDeadline: assignmentData.assignmentDeadline,
                  assignmentProgress: "TBA",
                  assignmentPayment: 0,
                  assignmentPaymentAccount: '',
                  assignmentPaymentDate: '',
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
                  // Create a new Assignment instance
                  const newAssignment = new Assignment({
                    assignmentName: assignmentData.assignmentName,
                    assignmentType: assignmentData.assignmentType,
                    assignmentDeadline: assignmentData.assignmentDeadline,
                    assignmentProgress: "TBA",
                    assignmentPayment: 0,
                    assignmentPaymentAccount: '',
                    assignmentPaymentDate: '',
                    assignmentGrade: "",
                    assignmentNature: "dynamic",
                    moduleCode: moduleCode,
                    referenceNumber: assignmentData.referenceNumber,
                  });

                  // Save the assignment to the database and collect its ObjectID
                  const savedAssignment = await newAssignment.save();
                  assignmentIDs.push(savedAssignment._id); // Collect each saved ID  
                  await updateModuleStudentAssignment(moduleCode, studentList[i],savedAssignment._id)                
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

export const createNewModuleStudentAssignment = async (moduleID, studentList, assignmentList) => {  
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
          // console.log("newModuleAssignment", newModuleAssignment);
        }
      }
    }
}

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

export const updateAssignment = async (req, res) => {
  try {
    const { assignmentID } = req.params;

    const {
      moduleCode,
      orderID,
      assignmentName,
      assignmentType,
      assignmentProgress,
      assignmentPayment,
      assignmentPaymentAccount,
      assignmentPaymentDate,
      assignmentDeadline,
      assignmentGrade,
      assignmentFile,
      assignmentNature,
    } = req.body;

    console.log(assignmentPaymentAccount, assignmentPaymentDate);
    

    // Update only the fields that are provided in the request body
    const updatedFields = {};

    if (orderID) updatedFields.orderID = orderID; // Only update if provided
    if (moduleCode) updatedFields.moduleCode = moduleCode;
    if (assignmentName) updatedFields.assignmentName = assignmentName;
    if (assignmentType) updatedFields.assignmentType = assignmentType;
    if (assignmentProgress) updatedFields.assignmentProgress = assignmentProgress;
    if (assignmentPayment) updatedFields.assignmentPayment = assignmentPayment;
    if (assignmentPaymentAccount) updatedFields.assignmentPaymentAccount = assignmentPaymentAccount;
    if (assignmentPaymentDate) updatedFields.assignmentPaymentDate = assignmentPaymentDate;
    if (assignmentDeadline) updatedFields.assignmentDeadline = assignmentDeadline;
    if (assignmentGrade) updatedFields.assignmentGrade = assignmentGrade;
    if (assignmentFile) updatedFields.assignmentFile = assignmentFile;
    if (assignmentNature) updatedFields.assignmentNature = assignmentNature;

    // Find the specific assignment by its ID and update it
    const assignment = await Assignment.findByIdAndUpdate(
      assignmentID,
      { $set: updatedFields },
      { new: true } // Return the updated document
    );

    if (assignment) {
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

async function createNewAssignmentManual(
  orderID,
  assignmentName,
  assignmentType,
  assignmentDeadline,
  assignmentProgress,
  assignmentPayment,
  assignmentPaymentAccount,
  assignmentPaymentDate,
  assignmentGrade,
  moduleCode,
  referenceNumber
) {
  const newAssignment = new Assignment({
    orderID: orderID,
    assignmentName: assignmentName,
    assignmentType: assignmentType,
    assignmentDeadline: assignmentDeadline,
    assignmentProgress: assignmentProgress,
    assignmentPayment: assignmentPayment,
    assignmentPaymentAccount: assignmentPaymentAccount,
    assignmentPaymentDate: assignmentPaymentDate,
    assignmentGrade: assignmentGrade,
    assignmentFile: [], // Default to empty array
    assignmentNature: "manual",
    moduleCode: moduleCode,
    referenceNumber: referenceNumber
  });
  const savedAssignment = await newAssignment.save();
  return savedAssignment;
}

async function findModuleIdByCode(moduleCode) {
  try {
    const module = await Module.findOne({ moduleCode: moduleCode }).select("_id");
    return module?._id;
  } catch (error) {
    console.error("Error finding module:", error);
  }
}

export const newAssignmentManual = async (req, res) => {  
  try {
    const {
      studentID,
      moduleCode,
      orderID,
      assignmentName,
      assignmentType,
      assignmentDeadline,
      assignmentProgress,
      assignmentPayment,
      assignmentPaymentAccount,
      assignmentPaymentDate,
      assignmentGrade,
    } = req.body;
    const moduleID = await findModuleIdByCode(moduleCode);
    const module = await ModuleAssignment.findOne({ moduleID, studentID });
    const createdAssignment = await createNewAssignmentManual(
      orderID,
      assignmentName,
      assignmentType,
      assignmentDeadline,
      assignmentProgress,
      assignmentPayment,
      assignmentPaymentAccount,
      assignmentPaymentDate,
      assignmentGrade,
      moduleCode
    );
    await ModuleAssignment.findOneAndUpdate(
      { _id: module._id },
      { $push: { assignments: createdAssignment._id } }
    )
      .then((result) => {
        if (result.matchedCount === 0) {
          console.log("No document found with the given _id.");
        } else {
          res.status(200).json({ value: "Assignment added successfully" });
        }
      })
      .catch((err) => {
        console.error("Error updating the document:", err);
      });
} catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteAssignment = async (req, res) => {
  const { assignmentID } = req.params;

  try {
    // Delete the assignment from the Assignment collection
    const deletedAssignment = await Assignment.findByIdAndDelete(assignmentID);
    if (!deletedAssignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Remove the assignment reference from any ModuleAssignment document that contains it
    await ModuleAssignment.updateMany(
      { assignments: assignmentID },
      { $pull: { assignments: assignmentID } }
    );

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
