import ModuleAssignment from '../models/moduleAssignment.models.js'
import { forceMongo } from '../utils/forceMongoFieldNotUnique.js';
export const newAssignment = async (req,res)=>{
  try{
    const {studentID,moduleID,assignmentID} = req.body
    const module = await ModuleAssignment.findOne({moduleID,studentID});
    if (module){
        await ModuleAssignment.findOneAndUpdate({ _id: module._id },{ $push: { assignmentID: assignmentID } } ).then(result => {
            if (result.matchedCount === 0) {
              console.log("No document found with the given _id.");
            } else {
              res.status(200).json({value:"Assignment added successfully"});
            }
          })
          .catch(err => {
            console.error("Error updating the document:", err);
          });
    }else{
        const newAssignment = new ModuleAssignment({
            studentID,
            moduleID,
            assignmentID,
          })
          if(newAssignment){
            await newAssignment.save();
            res.status(200).json({value:"Assignment added successfully"});
          }
    }
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});    
    }
}