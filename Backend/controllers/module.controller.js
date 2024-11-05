import ModuleAssignment from '../models/moduleAssignment.models.js';
import Assignment from '../models/assignment.models.js';
import Degree from '../models/degree.models.js';
import Module from '../models/module.models.js';
import mongoose from 'mongoose';
import { newAssignmentDynamic } from './assignment.controllers.js';

// New helper function to add the assignment to the Module model
export const addNewModule = async(moduleList) =>  {
  try {
    // Use Promise.all to save all Module concurrently    
    const addedModuleIDs = await Promise.all(
      moduleList.map(async (moduleData) => {
        // Finding the current Module in database to see if the ID already exists in database;
        let currentModule = await Module.findOne({
          moduleCode: moduleData.moduleCode,
        });
        if (currentModule) {          
          return currentModule._id;
        } else {
          // Create a new Student instance
          const newModule = new Module({
            moduleName: moduleData.moduleName,
            moduleCode: moduleData.moduleCode,
            moduleAssignments: await newAssignmentDynamic(moduleData.assignmentList),
          });

          // Save the student to the database and return the saved module's ObjectID
          const savedModule = await newModule.save();
          return savedModule._id;
          
        }
      })
    );    
    return addedModuleIDs; // Return the array of added student IDs
  } catch (error) {
    console.error("Error adding Modules:", error);
    throw new Error("Failed to add Modules");
  }
}

// Helper function to create a new assignment
async function moduleCreateNewAssignment(orderID, assignmentName, assignmentType, assignmentDeadline, assignmentProgress, assignmentPayment, assignmentGrade) {
  try {
    const newAssignment = new Assignment({
      orderID,
      assignmentName,
      assignmentType,
      assignmentDeadline,
      assignmentProgress,
      assignmentPayment,
      assignmentGrade,
      assignmentFile: [] // Default to an empty array
    });
    return await newAssignment.save();
  } catch (error) {
    console.error("Error creating new assignment:", error);
    throw new Error("Failed to create new assignment");
  }
}

// New helper function to add the assignment to the Module model
async function moduleAddAssignmentToModule(moduleID, assignment) {
  try {
    console.log(`Attempting to find and update module with ID: ${moduleID}`);
    const module = await Module.findOne({ _id: moduleID });
    if (module) {
      module.moduleAssignments.push(assignment._id);
      await module.save();
      console.log(`Assignment added to module ID: ${moduleID}`);
    } else {
      console.error("Module not found with the provided moduleID:", moduleID);
      throw new Error("Module not found");
    }
  } catch (error) {
    console.error("Error adding assignment to module:", error);
    throw new Error("Failed to add assignment to module");
  }
}


// Function to create a new assignment and update relevant records
export const newAssignment = async (assignmentName, assignmentType, assignmentDeadline, moduleID, studentList) => {
  try {
    // Create a new assignment record
    console.log("Creating assignment...");
    const createdAssignment = new Assignment({
      assignmentName,
      assignmentType,
      assignmentDeadline,
      assignmentFile: []
    });

    await createdAssignment.save();
    console.log("Assignment created successfully with ID:", createdAssignment._id);

    // Propagate assignment to each student in the module
    console.log("Propagating assignment to students...");
    await Promise.all(
      studentList.map(async (studentID) => {
        try {
          await ModuleAssignment.findOneAndUpdate(
            { moduleID, studentID },
            {
              $setOnInsert: { studentID, moduleID },
              $addToSet: {
                assignments: {
                  orderID: createdAssignment.orderID,
                  assignmentName: createdAssignment.assignmentName,
                  assignmentType: createdAssignment.assignmentType,
                  assignmentDeadline: createdAssignment.assignmentDeadline,
                }
              }
            },
            { upsert: true }
          );
          console.log(`Assignment added for student ID: ${studentID}`);
        } catch (error) {
          console.error(`Error updating ModuleAssignment for student ID ${studentID}:`, error);
          throw new Error("Failed to update ModuleAssignment for student");
        }
      })
    );

    // Link the assignment to the module
    console.log("Linking assignment to module...");
    try {
      await moduleAddAssignmentToModule(moduleID, createdAssignment);
      console.log("Assignment linked to module successfully.");
    } catch (error) {
      console.error("Error linking assignment to module:", error);
      throw new Error("Failed to link assignment to module");
    }

    console.log("Assignment added and propagated successfully.");
  } catch (error) {
    console.error("Error in newAssignment:", error);
    throw new Error("Failed to add assignment");
  }
};



export const getAssignment = async (req, res) => {
  try {
    const { studentID, moduleID } = req.params;

    const moduleAssignment = await ModuleAssignment.findOne({
      moduleID: new mongoose.Types.ObjectId(moduleID),
      studentID: new mongoose.Types.ObjectId(studentID)
    }).populate({
      path: 'orderID',
      model: 'Assignment',
      foreignField: 'orderID'
    });

    if (moduleAssignment) {
      res.status(200).json(moduleAssignment.orderID);
    } else {
      res.status(404).json({ error: "No module found for the provided student and module" });
    }
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
