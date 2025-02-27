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

export const newDegree = async (req, res) => {
  try {
    const {
      degreeID,
      degreeName,
      degreeYear,
      degreeAgent,
      degreeStudentList,
      degreeModules,
    } = req.body; // Expect assignmentData in the request body

    let currentDegree = await Degree.findOne({
      degreeID: degreeID,
    });
    const homeLink = `/task/${degreeYear}/${degreeID}`;
    const dataId = ''
    const degreeDetailsForPayment = { degreeID };
    if (currentDegree){
      const error = new Error("Degree ID already exists");
      error.code = 11000; // Set the error code
      throw error; // Throw the error object
    } else {
      const populatedStudentList = await addNewStudent(degreeStudentList, homeLink);
      const populatedModules = await addNewModule(
        degreeModules,
        populatedStudentList,
        degreeDetailsForPayment,
        homeLink
      );

      // Step 1: Create Degree
      const newDegree = new Degree({
        degreeID,
        degreeName,
        degreeYear,
        degreeAgent,
        degreeStudentList: populatedStudentList,
        degreeModules: populatedModules,
        metadata: {goTo: homeLink, dataId: dataId}
      });
      // console.log(newDegree);

      await newDegree.save();

      // Construct a human-readable log message
      const logMessage = { degreeName, degreeYear };

      // Create the log entry using the updated createLog signature
      await createLog({
        req,
        collection: "Degree",
        action: "create",
        actionToDisplay: "Create Degree",
        logMessage,
        affectedID: newDegree._id,
        metadata: newDegree.metadata,
      });

      res.status(200).json(newDegree);
    }
    
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: "Degree ID already exists" });
    } else {
      console.error("Error in newDegree:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
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
    } = req.body; // Expect assignmentData in the request body

    let currentDegree = await Degree.findOne({
      _id: degree_id,
    });

    if (currentDegree) {
      const populatedStudentList = await addNewStudent(degreeStudentList);
      const populatedModules = await addNewModule(
        degreeModules,
        populatedStudentList
      );

      let updatedDegree = await Degree.findOneAndUpdate(
        { _id: degree_id },
        {
          degreeID,
          degreeName,
          degreeYear,
          degreeAgent,
          degreeStudentList: populatedStudentList,
          degreeModules: populatedModules,
        },
        { new: true } // Return the updated document
      );

      // Construct the log message
      const logMessage = {degreeName, degreeYear};
      // Create the log entry (user details will be extracted inside createLog)
      await createLog({
        req,
        collection: "Degree",
        action: "update",
        actionToDisplay: "Update Degree",
        logMessage,
        affectedID: degree_id,
        metadata: updatedDegree.metadata,
      });

      res.status(200).json(updatedDegree);
    } else {
      res.status(404).json({ error: "No degree found with the specified ID" });
    }
    
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: "Degree ID already exists" });
    } else {
      console.error("Error in newDegree:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};


export const getAllDegree = async (req,res)=>{  
  try {
    let fillAgentDegree=[];
    const degrees = await Degree.find({})
      .populate('degreeStudentList');      
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
    const deletedDegree = await Degree.findOneAndDelete({ degreeID: degreeID }).then(
      async (degree) => {
        await Promise.all(
          degree.degreeModules.map(async (moduleID) => {
            await Module.findOneAndDelete({ _id: moduleID }).then(
              async (module) => {
                const allMixSchema = await ModuleAssignment.find({
                  moduleID: module._id,
                });
                await Promise.all(
                  allMixSchema.map(async (allMix) => {
                    // Delete the associated payment data first
                    if (allMix.modulePayment) {
                      await ModuleStudentFinance.findOneAndDelete({
                        _id: allMix.modulePayment,
                      });
                    }

                    // Then delete the ModuleAssignment
                    await ModuleAssignment.findOneAndDelete({
                      _id: allMix._id,
                    });
                  })
                );
                await Promise.all(
                  module.moduleAssignments.map(
                    async (moduleAssignmentsIDArr) => {
                      await Promise.all(
                        moduleAssignmentsIDArr.map(async (id) => {
                          await Assignment.findOneAndDelete({ _id: id });
                        })
                      );
                    }
                  )
                );
              }
            );
          })
        );
      }
    );

    // Log the deletion action
    const logMessage = {degreeName: deletedDegree.degreeName, degreeYear: deletedDegree.degreeYear};
    await createLog({
      req,
      collection: "Degree",
      actionToDisplay: "Delete Degree",
      action: "delete",
      logMessage,
    });

    res.status(200).json({ degreeID });
  } catch (error) {
    console.error("Error deleting Degree:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const deleteStudentFromDegree = async (req,res)=>{
  const {studentID,degreeID} = req.params
  try {
    const degree = await Degree.findOne({ degreeID: degreeID }).then(async (degree) => {
      const newArr = await Promise.all(
        degree.degreeStudentList.filter(
          (item) => item.toHexString() !== studentID
        )
      );
      await Degree.updateOne(
        { degreeID: degreeID },
        { $set: { degreeStudentList: newArr } }
      );
      await ModuleAssignment.deleteMany({ studentID: studentID });
    });

    // Log the removal action
    const logMessage = {degreeName: degree.degreeName, degreeYear: degree.degreeYear};
    await createLog({
      req,
      collection: "Degree",
      action: "delete",
      actionToDisplay: "Delete Student from Degree",
      logMessage,
      metadata: degree.metadata,
    });

    res.status(200).json({ studentID });
  } catch (error) {
    console.error("Error deleting Student:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}