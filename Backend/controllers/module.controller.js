import ModuleAssignment from '../models/moduleAssignment.models.js';
import Module from '../models/module.models.js';
import mongoose from 'mongoose';
import { createNewModuleStudentAssignment, newAssignmentDynamic } from './assignment.controller.js';
import Degree from '../models/degree.models.js';

// New helper function to add the assignment to the Module model
export const addNewModule = async(moduleList, studentList) =>  {
  try {
    // Use Promise.all to save all Module concurrently    
    const addedModuleIDs = await Promise.all(
      moduleList.map(async (moduleData) => {
        // Finding the current Module in database to see if the ID already exists in database;
        let currentModule = await Module.findOne({
          _id: moduleData._id,
        });
        if (currentModule) {
          const updatedModule = await Module.findOneAndUpdate(
            { _id: moduleData._id }, // Find the student by studentID
            {
              moduleName: moduleData.moduleName,
              moduleCode: moduleData.moduleCode,
              moduleAssignments: await newAssignmentDynamic(
                moduleData.assignmentList,
                studentList,
                moduleData.moduleCode
              ),
            },
            { new: true } // Return the updated document
          );
          // await createNewModuleStudentAssignment(
          //   updatedModule._id,
          //   studentList,
          //   updatedModule.moduleAssignments
          // );
          return updatedModule._id;
        }
        else {
          const newModule = new Module({
            moduleName: moduleData.moduleName,
            moduleCode: moduleData.moduleCode,
            moduleAssignments: await newAssignmentDynamic(
              moduleData.assignmentList,
              studentList,
              moduleData.moduleCode
            ),
          });

          const savedModule = await newModule.save();
          await createNewModuleStudentAssignment(
            savedModule._id,
            studentList,
            savedModule.moduleAssignments
          );
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


export const getAssignment = async (req, res) => {
  try {
    const { studentID, moduleID } = req.params;
    
    const moduleAssignment = await ModuleAssignment.findOne({
      moduleID: new mongoose.Types.ObjectId(moduleID),
      studentID: new mongoose.Types.ObjectId(studentID),
    }).populate("assignments");

    if (moduleAssignment) {
      res.status(200).json(moduleAssignment);
    } else {
      res.status(404).json({ error: "No module found for the provided student and module" });
    }
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getModuleData = async (req, res) => {
  try {
    const { degreeID, moduleID } = req.params;
    

    // Step 1: Retrieve the module details by moduleID
    const module = await Module.findById(moduleID).populate({
      path: "moduleAssignments",
      model: "Assignment", // Specify the model explicitly if needed
      match: { assignmentNature: "main" }, // Filter for assignments with assignmentNature: "main"
      select: "assignmentName assignmentType referenceNumber assignmentDeadline",
    });
    if (!module) {
      res
        .status(404)
        .json({ error: "No module found for the provided student and module" });
    }    
    const { moduleName, moduleCode, moduleAssignments } = module;
    // Step 2: Retrieve the student list for the given degree
    const degree = await Degree.findOne({ degreeID }).populate("degreeStudentList");
    if (!degree) {
      return { success: false, error: "Degree not found" };
    }

    const studentList = degree.degreeStudentList || [];
    
    const populatedStudentList = [];

    // Step 3: Iterate over each student in the list
    for (let i = 0; i < studentList.length; i++) {
      const student = studentList[i];            
      const tempStudent = {
        id: student.studentID,
        name: student.studentName,
        assignmentList: [],
      };

      // Step 4: Fetch assignments for each student for the specified module
      const assignmentResult = await getAssignmentForModule(student._id, moduleID);      

      if (assignmentResult.success) {
        tempStudent.assignmentList = assignmentResult.assignments;        
      } else {
        console.log(`No assignments found for student ${student._id} in module ${moduleID}`);
      }

      // Step 5: Add the temp student object to the populated student list
      populatedStudentList.push(tempStudent);
    }    
     // Step 6: Send JSON response with module details and populated student list
     res.status(200).json({
       moduleName,
       moduleCode,
       moduleData: populatedStudentList,
       moduleAssignments,
     });
  } catch (error) {
    console.error("Error in getAssignmentNew:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAssignmentForModule = async (studentID, moduleID) => {
  try {
    // Find the module assignment by moduleID and studentID
    const moduleAssignment = await ModuleAssignment.findOne({
      moduleID: new mongoose.Types.ObjectId(moduleID),
      studentID: new mongoose.Types.ObjectId(studentID),
    }).populate({
      path: "assignments",
      select:
        "-assignmentFile -assignmentGrade -assignmentNature -assignmentPayment -assignmentProgress",
    });
    

    if (moduleAssignment) {
      // Extract assignments list to return to the caller
      const assignmentsList = moduleAssignment.assignments || [];
      
      return { success: true, assignments: assignmentsList };
    } else {
      return { success: false, error: "No module found for the provided student and module" };
    }
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return { success: false, error: "Internal Server Error" };
  }
};


