import Degree from '../models/degree.models.js'
import User from "../models/user.models.js";
import { addNewStudent } from './student.controller.js';

export const newDegree = async (req,res)=>{
  try{
    const {degreeID,degreeName,degreeYear,degreeAgent,degreeStudentList,degreeModules } = req.body

    // Create Degree
    const newDegree = new Degree({
      degreeID,
      degreeName,
      degreeYear,
      degreeAgent,
      degreeStudentList: await addNewStudent(degreeStudentList),
      degreeModules
    })
    if(newDegree){
      await newDegree.save();
      res.status(200).json({newDegree});
    }
    }catch(error){
      if(error.code==11000){        
        res.status(409).json({error:"Degree ID already exists"});
      }else{
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
      }
    }
}
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

