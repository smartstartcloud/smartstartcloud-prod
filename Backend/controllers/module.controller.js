import ModuleAssignment from '../models/moduleAssignment.models.js';
import Assignment from '../models/assignment.models.js';
import Module from '../models/module.models.js'; // Import the new Module model

export const newAssignment = async (req, res) => {
  try {
    const {
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

    const module = await ModuleAssignment.findOne({ moduleID, studentID });
    if (module) {
      if (module.orderID.includes(orderID)) {
        res.status(400).json({ error: "Order ID already exists" });
      } else {
        const createdAssignment = await createNewAssignment(orderID, assignmentName, assignmentType, assignmentDeadline, assignmentProgress, assignmentPayment, assignmentGrade);

        await ModuleAssignment.findOneAndUpdate(
          { _id: module._id },
          { $push: { orderID: createdAssignment.orderID } }
        ).then(result => {
          if (result.matchedCount === 0) {
            console.log("No document found with the given _id.");
          } else {
            // Add assignment to the Module model
            await addAssignmentToModule(moduleID, createdAssignment);
            res.status(200).json({ value: "Assignment added successfully" });
          }
        }).catch(err => {
          console.error("Error updating the document:", err);
        });
      }
    } else {
      try {
        const createdAssignment = await createNewAssignment(orderID, assignmentName, assignmentType, assignmentDeadline, assignmentProgress, assignmentPayment, assignmentGrade);
        const newAssignment = new ModuleAssignment({
          studentID,
          moduleID,
          orderID: createdAssignment.orderID
        });
        if (newAssignment) {
          await newAssignment.save();
          // Add assignment to the Module model
          await addAssignmentToModule(moduleID, createdAssignment);
          res.status(200).json({ value: "Assignment added successfully" });
        }
      } catch (error) {
        if (error.code == 11000) {
          res.status(400).json({ error: "Order ID already exists" });
        } else {
          console.log(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    }
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
