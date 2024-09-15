import express from 'express'
import Degree from '../models/degree.models.js'
const app = express.Router()

app.post("/",async (req,res)=>{
    const dID = req.body.dID;
    const name = req.body.name;
    const year = req.body.name;
    const user = req.body.user;
    const studentList = req.body.studentList;
    const modules = req.body.modules;

  // Create User
  const newDegree = new Degree({
    dID,
    name,
    year,
    user,
    studentList,
    modules
  })
  try{
    if(newDegree){
      await newDegree.save();
      res.sendStatus(200);
    }
  }catch(error){
    if(error.code==11000){
      res.status(409).json({error:"Degree ID already exists"});
    }
    res.status(500).json({error:"Internal Server Error"});
   
  }
  })

export default app;
