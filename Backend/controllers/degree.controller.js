import Degree from '../models/degree.models.js';
import Student from '../models/student.models.js';
import User from "../models/user.models.js";
import { addNewStudent } from './student.controller.js';
import { addNewModule, newAssignment } from './module.controller.js'; // Import newAssignment

export const newDegree = async (req, res) => {
  try {
    const { degreeID, degreeName, degreeYear, degreeAgent, degreeStudentList, degreeModules, assignmentData } = req.body; // Expect assignmentData in the request body

    // Step 1: Create Degree
    const newDegree = new Degree({
      degreeID,
      degreeName,
      degreeYear,
      degreeAgent,
      degreeStudentList: await addNewStudent(degreeStudentList),
      degreeModules: await addNewModule(degreeModules)
    });
    console.log(newDegree);

    // Step 2: Save Degree
    await newDegree.save();

    // Step 3: Create the assignment
    const createdAssignment = await newAssignment(assignmentData); // Assuming newAssignment returns the created assignment

    // Step 4: Add the assignment to all students in the module
    const studentList = newDegree.degreeStudentList; // Get the student IDs from the degree
    const moduleID = newDegree.degreeModules[0]; // Assuming you want to populate assignments for the first module

    await Promise.all(studentList.map(async (studentID) => {
      await ModuleAssignment.findOneAndUpdate(
        { moduleID, studentID },
        {
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
    }));

    res.status(200).json({ newDegree, createdAssignment });
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


export const getDegreeByID = async (req,res)=>{
  const {degreeID} = req.params
  try {
    const degrees = await Degree.findOne({degreeID})
      .populate('degreeStudentList');
    const Agent = await User.find({_id:[degrees.degreeAgent]});
    let degreeObject = degrees.toObject();
    degreeObject.degreeAgent = {"_id":Agent[0]._id,"firstName":Agent[0].firstName,"lastName":Agent[0].lastName};
      res.status(200).json(degreeObject);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

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

