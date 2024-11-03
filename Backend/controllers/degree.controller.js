import Degree from '../models/degree.models.js'
import Student from '../models/student.models.js';
import User from "../models/user.models.js";
import { addNewStudent } from './student.controller.js';
import { newAssignment } from './module.controller.js';

export const newDegree = async (req, res) => {
  try {
    const { 
      degreeID, 
      degreeName, 
      degreeYear, 
      degreeAgent, 
      degreeStudentList, 
      degreeModules,
      // Assuming assignment details are passed here when creating a degree
      assignmentDetails // Include assignment details from the form submission
    } = req.body;

    // Step 1: Create Degree
    const newDegree = new Degree({
      degreeID,
      degreeName,
      degreeYear,
      degreeAgent,
      degreeStudentList: await addNewStudent(degreeStudentList),
      degreeModules
    });

    if (newDegree) {
      await newDegree.save();
      
      // Step 2: Call newAssignment function after saving the degree
      if (assignmentDetails) {
        const { 
          moduleID, 
          orderID, 
          assignmentName, 
          assignmentType, 
          assignmentDeadline, 
          assignmentProgress, 
          assignmentPayment, 
          assignmentGrade 
        } = assignmentDetails;

        // Calling the newAssignment function with the provided assignment details
        await newAssignment({
          body: {
            moduleID,
            orderID,
            assignmentName,
            assignmentType,
            assignmentDeadline,
            assignmentProgress,
            assignmentPayment,
            assignmentGrade
          }
        }, res);
      }

      res.status(200).json({ newDegree });
    }
  } catch (error) {
    if (error.code == 11000) {
      res.status(409).json({ error: "Degree ID already exists" });
    } else {
      console.error("Error creating degree:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

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

