import ModuleAssignment from '../models/moduleAssignment.models.js';
import Assignment from '../models/assignment.models.js';
import Degree from '../models/degree.models.js';
import Module from '../models/module.models.js'; // Import the new Module model

export const newAssignment = async (req, res) => {
  try {
    const {
      degreeID, // Accepting degreeID from the form
      studentID, 
      moduleID, 
      orderID, 
      assignmentName, 
      assignmentType, 
      assignmentDeadline, 
      assignmentProgress, 
      assignmentPayment, 
      assignmentGrade
    } = req.body;

    // Step 1: Fetch the degree based on degreeID or degreeModules
    const degree = await Degree.findOne({ _id: degreeID });
    
    if (!degree) {
      return res.status(404).json({ error: "Degree not found" });
    }

    const studentList = degree.degreeStudentList; // Array of student IDs

    // Step 2: Create the new assignment
    const createdAssignment = await createNewAssignment(orderID, assignmentName, assignmentType, assignmentDeadline, assignmentProgress, assignmentPayment, assignmentGrade);

    // Step 3: Update ModuleAssignment for each student in the degree
    await Promise.all(studentList.map(async (studentID) => {
      let moduleAssignment = await ModuleAssignment.findOne({ moduleID, studentID });

      if (moduleAssignment) {
        // If student already has the module, add the new assignment
        if (!moduleAssignment.orderID.includes(orderID)) {
          await ModuleAssignment.findOneAndUpdate(
            { _id: moduleAssignment._id },
            { $push: { orderID: createdAssignment.orderID } }
          );
        }
      } else {
        // Create a new ModuleAssignment if it doesn't exist for the student
        const newModuleAssignment = new ModuleAssignment({
          studentID,
          moduleID,
          orderID: createdAssignment.orderID
        });
        await newModuleAssignment.save();
      }
    }));

    // Step 4: Also add the assignment to the Module model (existing functionality)
    await addAssignmentToModule(moduleID, createdAssignment);

    res.status(200).json({ message: "Assignment added and propagated to all students in the degree successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAssignment = async (req, res) => {
  try {
    const { studentID, moduleID } = req.params;

    const module = await ModuleAssignment.findOne({ moduleID, studentID }).populate({
      path: 'orderID',
      model: 'Assignment',
      foreignField: 'orderID'
    });
    if (module) {
      res.status(200).json(module.orderID);
    } else {
      res.status(400).json({ error: "No module found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Helper function to create a new assignment
async function createNewAssignment(orderID, assignmentName, assignmentType, assignmentDeadline, assignmentProgress, assignmentPayment, assignmentGrade) {
  const newAssignment = new Assignment({
    orderID: orderID,
    assignmentName: assignmentName,
    assignmentType: assignmentType,
    assignmentDeadline: assignmentDeadline,
    assignmentProgress: assignmentProgress,
    assignmentPayment: assignmentPayment,
    assignmentGrade: assignmentGrade,
    assignmentFile: [] // Default to empty array
  });
  const savedAssignment = await newAssignment.save();
  return savedAssignment;
}

// New helper function to add the assignment to the Module model
async function addAssignmentToModule(moduleID, assignment) {
  try {
    const module = await Module.findOne({ _id: moduleID });
    if (module) {
      module.moduleAssignments.push({
        assignmentID: assignment._id,
        assignmentName: assignment.assignmentName,
        assignmentType: assignment.assignmentType,
        assignmentDeadline: assignment.assignmentDeadline
      });
      await module.save();
    } else {
      console.error("Module not found with the provided moduleID");
    }
  } catch (error) {
    console.error("Error adding assignment to module:", error);
  }
}
