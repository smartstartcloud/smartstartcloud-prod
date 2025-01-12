import Degree from '../models/degree.models.js';
import Student from '../models/student.models.js';
import Assignment from '../models/assignment.models.js';
import Module from '../models/module.models.js';
import User from "../models/user.models.js";
import { addNewStudent } from './student.controller.js';
import { addNewModule } from './module.controller.js'; // Import newAssignment
import ModuleAssignment from '../models/moduleAssignment.models.js';
import ModuleStudentFinance from '../models/moduleStudentFinance.models.js';

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

    if (currentDegree){
      const error = new Error("Degree ID already exists");
      error.code = 11000; // Set the error code
      throw error; // Throw the error object
    } else {
      const populatedStudentList = await addNewStudent(degreeStudentList);
      const populatedModules = await addNewModule(
        degreeModules,
        populatedStudentList
      );

      // Step 1: Create Degree
      const newDegree = new Degree({
        degreeID,
        degreeName,
        degreeYear,
        degreeAgent,
        degreeStudentList: populatedStudentList,
        degreeModules: populatedModules,
      });
      // console.log(newDegree);

      await newDegree.save();

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
        }
      );
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
        const degreeObject = x.toObject();
        degreeObject.degreeAgent = {"_id":Agent[0]._id,"firstName":Agent[0].firstName,"lastName":Agent[0].lastName};
        fillAgentDegree.push(degreeObject);
      })
    )
    res.status(200)  .json(fillAgentDegree);
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
      const degreeSum = await getAssignmentSum(moduleList, studentList);
      
      const degreeObject = x.toObject();
      degreeObject.degreeAgent = {"_id":Agent[0]._id,"firstName":Agent[0].firstName,"lastName":Agent[0].lastName};
      degreeObject.degreeSum = degreeSum
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
  try {
    const degrees = await Degree.findOne({ degreeID })
      .populate("degreeStudentList")
      .populate({
        path: "degreeModules", // Populate degreeModules
        populate: {
          path: "moduleAssignments", // Populate moduleAssignments within each degreeModule
          model: "Assignment", // Specify the model explicitly if needed
          match: { assignmentNature: "main" }, // Filter for assignments with assignmentNature: "main"
        },
      });
    const Agent = await User.find({_id:[degrees.degreeAgent]});
    const moduleList = degrees.degreeModules;
    const studentList = degrees.degreeStudentList;
    const { moduleDetailsList } =
      await getAssignmentDetailsList(moduleList, studentList);
    let degreeObject = degrees.toObject();
    degreeObject.degreeAgent = {"_id":Agent[0]._id,"firstName":Agent[0].firstName,"lastName":Agent[0].lastName};
    degreeObject.moduleDetailsList = moduleDetailsList
    res.status(200).json(degreeObject);
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
      "assignmentPayment assignmentGrade assignmentProgress"
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
            // Calculate sum of assignmentPayment
            if (
              assignment.assignmentPayment &&
              assignment.assignmentPayment !== "N/A"
            ) {
              moduleDetails.moduleSum += Number(assignment.assignmentPayment);
            }

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
    const {degreeID} = req.params
      await Degree.findOneAndDelete({degreeID:degreeID}).then(async (degree)=>{
        await Promise.all(degree.degreeModules.map(async (moduleID)=>{
            await Module.findOneAndDelete({_id:moduleID}).then(async(module)=>{
              const allMixSchema = await ModuleAssignment.find({moduleID:module._id});
              await Promise.all(allMixSchema.map(async(allMix)=>{
                // Delete the associated payment data first
                if (allMix.modulePayment) {
                  await ModuleStudentFinance.findOneAndDelete({
                    _id: allMix.modulePayment,
                  });
                }

                // Then delete the ModuleAssignment
                await ModuleAssignment.findOneAndDelete({ _id: allMix._id });
              }))
              await Promise.all(module.moduleAssignments.map(async (moduleAssignmentsIDArr)=>{
                await Promise.all(moduleAssignmentsIDArr.map(async(id)=>{
                    await Assignment.findOneAndDelete({_id:id});
                }))
              }))
            })
        }))
      });
      res.status(200).json({degreeID});
  } catch (error) {
    console.error("Error deleting Degree:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
export const deleteStudentFromDegree = async (req,res)=>{
  const {studentID,degreeID} = req.params
  try {
    await Degree.findOne({degreeID:degreeID}).then(async (degree)=>{
      const newArr = await Promise.all(degree.degreeStudentList.filter(item => item.toHexString()!==studentID));
      await Degree.updateOne({degreeID:degreeID},{$set:{degreeStudentList:newArr}});
      await ModuleAssignment.deleteMany({studentID:studentID});
    });
    res.status(200).json({studentID});
  } catch (error) {
    console.error("Error deleting Student:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}