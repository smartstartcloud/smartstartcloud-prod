import Degree from '../models/degree.models.js';
import Student from '../models/student.models.js';
import Assignment from '../models/assignment.models.js';
import Module from '../models/module.models.js';
import User from "../models/user.models.js";
import { addNewStudent } from './student.controller.js';
import { addNewModule } from './module.controller.js'; // Import newAssignment
import ModuleAssignment from '../models/moduleAssignment.models.js';
import ModuleStudentFinance from '../models/moduleStudentFinance.models.js';
import { createLog } from './log.controller.js';
import { extractToken } from '../utils/generateToken.js';

export const newDegree = async (req, res) => {
  try {
    const {
      degreeID,
      degreeName,
      degreeYear,
      degreeAgent,
      degreeStudentList,
      degreeModules,
    } = req.body;

    let currentDegree = await Degree.findOne({ degreeID });
    if (currentDegree) {
      return res.status(409).json({ error: "Degree ID already exists" });
    }

    const homeLink = `/task/${degreeYear}/${degreeID}`;
    const dataId = "";
    const testToken = req.headers.cookie;
    const { userId } = extractToken(testToken);
    const user = await User.findById(userId, "firstName lastName userName");
    const userDetails = { userID: userId, userName: user?.userName || "" };

    // Step 1: Save minimal degree record first
    const newDegree = new Degree({
      degreeID,
      degreeName,
      degreeYear,
      degreeAgent,
      degreeStudentList: [],
      degreeModules: [],
      metadata: { goTo: homeLink, dataId },
    });
    await newDegree.save();

    // Step 2: Respond quickly
    res.status(202).json({
      message: "Degree creation in progress",
      degreeID: newDegree._id,
    });

    // Step 3: Continue processing in the background
    setImmediate(async () => {
      try {
        const populatedStudentList = await addNewStudent(
          degreeStudentList,
          homeLink,
          userDetails
        );

        const populatedModules = await addNewModule(
          degreeModules,
          populatedStudentList,
          homeLink,
          userDetails
        );

        newDegree.degreeStudentList = populatedStudentList;
        newDegree.degreeModules = populatedModules;
        await newDegree.save();

        await createLog({
          req,
          collection: "Degree",
          action: "create",
          actionToDisplay: "Create Degree",
          logMessage: { degreeName, degreeYear },
          affectedID: newDegree._id,
          metadata: newDegree.metadata,
        });

        console.log(`Degree ${degreeID} creation complete`);
      } catch (bgErr) {
        console.error("Background Degree processing failed:", bgErr.message);
      }
    });
  } catch (error) {
    console.error("Error in newDegree:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateDegree = async (req, res) => {
  try {
    const { degree_id } = req.params;
    const {
      degreeID,
      degreeName,
      degreeYear,
      degreeAgent,
      degreeStudentList,
      degreeModules,
    } = req.body;

    let currentDegree = await Degree.findOne({ _id: degree_id });
    if (!currentDegree) {
      return res
        .status(404)
        .json({ error: "No degree found with the specified ID" });
    }

    const testToken = req.headers.cookie;
    const { userId } = extractToken(testToken);
    const user = await User.findById(userId, "firstName lastName userName");
    const userDetails = { userID: userId, userName: user?.userName || "" };

    // Step 1: Respond quickly
    res.status(202).json({
      message: "Degree update in progress",
      degreeID: degree_id,
    });

    // Step 2: Background update
    setImmediate(async () => {
      try {
        const populatedStudentList = await addNewStudent(
          degreeStudentList,
          null,
          userDetails
        );
        const populatedModules = await addNewModule(
          degreeModules,
          populatedStudentList,
          null,
          userDetails
        );

        const updatedDegree = await Degree.findOneAndUpdate(
          { _id: degree_id },
          {
            degreeID,
            degreeName,
            degreeYear,
            degreeAgent,
            degreeStudentList: populatedStudentList,
            degreeModules: populatedModules,
          },
          { new: true }
        );

        const logMessage = { degreeName, degreeYear };
        await createLog({
          req,
          collection: "Degree",
          action: "update",
          actionToDisplay: "Update Degree",
          logMessage,
          affectedID: degree_id,
          metadata: updatedDegree.metadata,
        });

        console.log(`Degree ${degreeID} updated successfully`);
      } catch (bgErr) {
        console.error("Background update failed:", bgErr.message);
      }
    });
  } catch (error) {
    console.error("Error in updateDegree:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAllDegree = async (req,res)=>{  
  try {    
    let fillAgentDegree=[];
    const degrees = await Degree.find({})
      // .populate('degreeStudentList');      
      await Promise.all( degrees.map(async (x)=>{        
        const Agent = await User.find({_id:[x.degreeAgent]});
        if (Agent.length === 0) {
            // console.log(`Agent with ID ${x.degreeAgent} not found.`);
            return; // Skip this degree if no agent is found
        }
        const degreeObject = x.toObject();
        degreeObject.degreeAgent = {
            "_id": Agent[0]._id,
            "firstName": Agent[0].firstName,
            "lastName": Agent[0].lastName
        };
        fillAgentDegree.push(degreeObject);
      })
    )    
    res.status(200).json(fillAgentDegree);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getDegreeByYear = async (req,res)=>{
  const {degreeYear} = req.params
  try {
    let fillAgentDegree=[];
    const degrees = await Degree.find({degreeYear})
    
    await Promise.all( degrees.map(async (x)=>{
      const Agent = await User.find({_id:[x.degreeAgent]});
      const moduleList = x.degreeModules;
      const studentList = x.degreeStudentList
      // const degreeSum = await getAssignmentSum(moduleList, studentList);
      if (Agent.length === 0) {
          // console.log(`Agent with ID ${x.degreeAgent} not found.`);
          return; // Skip this degree if no agent is found
      }
      const degreeObject = x.toObject();
      degreeObject.degreeAgent = {"_id":Agent[0]._id,"firstName":Agent[0].firstName,"lastName":Agent[0].lastName};
      // degreeObject.degreeSum = degreeSum
      fillAgentDegree.push(degreeObject);
    })
  )
    res.status(200).json(fillAgentDegree);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getAssignmentSum = async (moduleList, studentList) => {  
  try {
    let sum = 0;
    // Fetch all relevant ModuleAssignments in a single query
    const moduleAssignments = await ModuleAssignment.find({
      studentID: { $in: studentList },
      moduleID: { $in: moduleList },
    }).populate("assignments");
    
    moduleAssignments.forEach((moduleAssignment) => {
      if (moduleAssignment.assignments) {
        moduleAssignment.assignments.forEach((assignment) => {
          if (
            assignment.assignmentPayment &&
            assignment.assignmentPayment !== "N/A" &&
            assignment.assignmentPayment !== "0"
          ) {
            sum += Number(assignment.assignmentPayment);
          }
        });
      }
    });
    return sum;
  } catch (error) {
    console.error("Error fetching assignments: ", error);
  }
};

export const getDegreeByID = async (req,res)=>{
  const {degreeID} = req.params

  if (!degreeID) {
    return res.status(400).json({ error: "degreeID is required" });
  }
  try {
    const degrees = await Degree.findOne({ degreeID })
      .populate("degreeStudentList")
      .populate({
        path: "degreeModules",
        populate: {
          path: "moduleAssignments", // Populate moduleAssignments within each degreeModule
          model: "Assignment", // Specify the model explicitly if needed
          match: { assignmentNature: "main" }, // Filter for assignments with assignmentNature: "main"
        },
      })
      .lean(); // Convert Mongoose document to plain JS object 

    if (!degrees) {
      return res.status(404).json({ error: "Degree not found" });
    }

    const agent = await User.findById(degrees.degreeAgent).select("_id firstName lastName").lean();
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const moduleList = degrees.degreeModules || [];
    const studentList = degrees.degreeStudentList || [];

    const { moduleDetailsList } = await getAssignmentDetailsList(moduleList, studentList);

    degrees.degreeAgent = agent; // Assign the agent object
    degrees.moduleDetailsList = moduleDetailsList; // Assign module details

    res.status(200).json(degrees);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getAssignmentDetailsList = async (moduleList, studentList) => {    
  try {
    // Step 1: Fetch all relevant ModuleAssignments in a single query
    const moduleAssignments = await ModuleAssignment.find({
      studentID: { $in: studentList.map((student) => student._id) },
      moduleID: { $in: moduleList.map((module) => module._id) },
    }).populate(
      "assignments",
      "assignmentGrade assignmentProgress"
    );
    const moduleDetailsList = moduleList.map((module) => {
      return {_id:module._id, modulecode:module.moduleCode, moduleName: module.moduleName, modulePayment: [], moduleGrade: [], moduleProgress: [], moduleSum : 0};
    })    

    // Step 2: Initialize results
    let sum = 0;
    const assignmentProgressList = [];
    const assignmentGradeList = [];

    // Step 3: Process the fetched assignments
    moduleAssignments.forEach((moduleAssignment) => {    
      if (moduleAssignment.assignments) {
        const moduleDetails = moduleDetailsList.find(
          (module) =>
            module._id.toString() === moduleAssignment.moduleID.toString()
        );
        if (moduleDetails) {          
          moduleAssignment.assignments.forEach((assignment) => {
            // Collect assignmentGrade
            if (
              assignment.assignmentGrade &&
              assignment.assignmentGrade !== "N/A"
            ) {
              moduleDetails.moduleGrade.push(assignment.assignmentGrade);
            }

            // Collect assignmentProgress
            if (
              assignment.assignmentProgress &&
              assignment.assignmentProgress !== "N/A"
            ) {
              moduleDetails.moduleProgress.push(assignment.assignmentProgress);
            }
          });
        }
      }
    });    
    return { moduleDetailsList };
  } catch (error) {
    console.error("Error fetching assignments: ", error);
  }
};

export const getDegreeByAgent = async (req,res)=>{
  const {degreeAgent} = req.params
  
  try {
    let fillAgentDegree=[];
    const degrees = await Degree.find({degreeAgent:degreeAgent})
      .populate('degreeStudentList');
    await Promise.all( degrees.map(async (x)=>{
      const Agent = await User.find({_id:[x.degreeAgent]});
      if (Agent.length === 0) {
          // console.log(`Agent with ID ${x.degreeAgent} not found.`);
          return; // Skip this degree if no agent is found
      }
      const degreeObject = x.toObject();
      degreeObject.degreeAgent = {"_id":Agent[0]._id,"firstName":Agent[0].firstName,"lastName":Agent[0].lastName};
      fillAgentDegree.push(degreeObject);
    })
  )     
    res.status(200).json(fillAgentDegree);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getStudentByID = async (req,res)=>{
  const {studentID} = req.params
  try {
    const student = await Student.findOne({studentID})
      res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const deleteDegree = async (req,res)=>{
  try {
    const { degreeID } = req.params;
    // Check if degree exists before continuing
    const deletedDegree = await Degree.findOne({ degreeID: degreeID });
    if (!deletedDegree) {
      return res
        .status(404)
        .json({ error: "No degree found with the provided degreeID." });
    }
    
    // Respond immediately to the client
    res.status(202).json({
      message: "Degree deletion in progress",
      degreeID,
    });
    
    // Continue deletion in background
    setImmediate(async () => {
      try {
        // Actually delete the degree now
        await Degree.findOneAndDelete({ degreeID });

        // Delete associated modules
        await Promise.all(
          deletedDegree.degreeModules.map(async (moduleID) => {
            const module = await Module.findOneAndDelete({ _id: moduleID });
            
            if (!module) {
              console.log(`No module found with ID ${moduleID}`);
              return;
            }
            console.log("Module Deleted from degree - ", moduleID);
            const allMixSchema = await ModuleAssignment.find({
              moduleID: module._id,
            });

            await Promise.all(
              allMixSchema.map(async (allMix) => {
                // Delete associated payment data
                if (allMix.modulePayment) {
                  await ModuleStudentFinance.findOneAndDelete({
                    _id: allMix.modulePayment,
                  });
                  console.log(
                    "ModuleStudentFinance Deleted from degree - ",
                    allMix.modulePayment
                  );
                }

                await ModuleAssignment.findOneAndDelete({ _id: allMix._id });
                console.log(
                  "ModuleAssignment Deleted from degree - ",
                  allMix._id
                );
              })
            );

            // Delete the assignments associated with the module
            await Promise.all(
              module.moduleAssignments.map(async (moduleAssignmentsIDArr) => {
                await Promise.all(
                  moduleAssignmentsIDArr.map(async (id) => {
                    await Assignment.findOneAndDelete({ _id: id });
                    console.log("assignment Deleted from degree - ", id);
                  })
                );
              })
            );
          })
        );

        // Delete associated students
        await Promise.all(
          deletedDegree.degreeStudentList.map(async (studentID) => {
            await Student.findOneAndDelete({ _id: studentID });
            console.log("student Deleted from degree - ", studentID)
          })
        );

        // Log the deletion
        const logMessage = {
          degreeName: deletedDegree.degreeName,
          degreeYear: deletedDegree.degreeYear,
        };
        try {
          await createLog({
            req,
            collection: "Degree",
            actionToDisplay: "Delete Degree",
            action: "delete",
            logMessage,
          });
        } catch (logError) {
          console.error("Log creation failed (delete):", logError.message);
        }

        console.log(`Degree ${degreeID} deleted successfully`);
      } catch (bgErr) {
        console.error("Background degree deletion failed:", bgErr.message);
      }
    });
  } catch (error) {
    console.error("Error deleting Degree:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const deleteStudentFromDegree = async (req,res)=>{
  const {studentID,degreeID} = req.params  
  try {
    // Find all module assignments by studentID
    const modules = await ModuleAssignment.find({ studentID: studentID });
    // Delete related assignments
    await Promise.all(
      modules.map(async (mod) => {        
        await Promise.all(
          mod.assignments.map(async (assignmentId) => {
            await Assignment.findByIdAndDelete(assignmentId);
          })
        );
      })
    );

    // Delete the module assignments
    await ModuleAssignment.deleteMany({ studentID: studentID });

    await Student.findByIdAndDelete({_id: studentID});

    const degree = await Degree.findOne({ degreeID: degreeID });
    const newArr = await Promise.all(
      degree.degreeStudentList.filter(
        (item) => item.toHexString() !== studentID
      )
    );
    await Degree.updateOne(
      { degreeID: degreeID },
      { $set: { degreeStudentList: newArr } }
    );

    // Log the removal action
    const logMessage = {
      degreeName: degree.degreeName,
      degreeYear: degree.degreeYear,
    };
    try {
      await createLog({
        req,
        collection: "Degree",
        action: "delete",
        actionToDisplay: "Delete Student from Degree",
        logMessage,
        metadata: degree.metadata,
      });
    } catch (logError) {
      console.error("Log creation failed (delete student):", logError.message);
    }

    res.status(200).json({ studentID });
  } catch (error) {
    console.error("Error deleting Student:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}