import Degree from '../models/degree.models.js'
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
      res.sendStatus(200).json({newDegree});
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
export const getDegree = async (req,res)=>{
  try {
    const degrees = await Degree.find({});
    res.status(200).json(degrees);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}