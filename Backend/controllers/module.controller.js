import ModuleAssignment from '../models/moduleAssignment.models.js'
import Assignment from '../models/assignment.models.js';
export const newAssignment = async (req,res)=>{
  try{
    const {studentID,moduleID,orderID,assignmentName,assignmentType,assignmentDeadline,assignmentProgress,assignmentPayment} = req.body
    
    const module = await ModuleAssignment.findOne({moduleID,studentID});
    if (module){
        if(module.orderID.includes(orderID)){
          res.status(400).json({error:"Order ID already exists"});
        }else{
          const createdAssignment = await createNewAssignment(orderID,assignmentName,assignmentType,assignmentDeadline,assignmentProgress,assignmentPayment);
          await ModuleAssignment.findOneAndUpdate({ _id: module._id },{ $push: { orderID: createdAssignment.orderID } } ).then(result => {
            if (result.matchedCount === 0) {
              console.log("No document found with the given _id.");
            } else {
              res.status(200).json({value:"Assignment added successfully"});
            }
          })
          .catch(err => {
            console.error("Error updating the document:", err);
          });
        }
    }else{
      try{
        const createdAssignment = await createNewAssignment(orderID,assignmentName,assignmentType,assignmentDeadline,assignmentProgress,assignmentPayment);
        const newAssignment = new ModuleAssignment({
            studentID,
            moduleID,
            orderID:createdAssignment.orderID
          })
          if(newAssignment){
            await newAssignment.save();
            res.status(200).json({value:"Assignment added successfully"});
          }
        }catch(error){
          if(error.code==11000){        
            res.status(400).json({error:"Order ID already exists"});
          }else{
            console.log(error);
            res.status(500).json({error:"Internal Server Error"});
          }
        }
    }
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});    
    }
}

export const getAssignment = async (req,res)=>{
  try{
    const {studentID,moduleID} = req.params
    
    const module = await ModuleAssignment.findOne({moduleID,studentID}).populate({
      path: 'orderID',  // The field we want to populate
      model: 'Assignment', // The model to populate from
      foreignField: 'orderID'  // Match based on orderID
    });
    if (module){
      res.status(200).json(module.orderID);
    }else{
        res.status(400).json({error:"No module found"})
    }
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});    
    }
}


async function createNewAssignment(orderID,assignmentName,assignmentType,assignmentDeadline,assignmentProgress,assignmentPayment){
  const newAssignment = new Assignment({
    orderID: orderID,
    assignmentName: assignmentName,
    assignmentType: assignmentType,
    assignmentDeadline: assignmentDeadline,
    assignmentProgress: assignmentProgress,
    assignmentPayment: assignmentPayment,
    assignmentFile: [] // Default to empty array
  });
  const savedAssignment = await newAssignment.save();
  return savedAssignment;
}