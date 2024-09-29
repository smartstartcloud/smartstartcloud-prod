import ModuleAssignment from '../models/moduleAssignment.models.js'
export const newAssignment = async (req,res)=>{
  try{
    const {studentID,moduleID,orderID} = req.body
    const module = await ModuleAssignment.findOne({moduleID,studentID});
    if (module){
        if(module.orderID.includes(orderID)){
          res.status(400).json({value:"Order ID already exists"});
        }else{
          await ModuleAssignment.findOneAndUpdate({ _id: module._id },{ $push: { orderID: orderID } } ).then(result => {
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
        const newAssignment = new ModuleAssignment({
            studentID,
            moduleID,
            orderID,
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

export const getAssignment = async (req,res)=>{
  try{
    const {studentID,moduleID} = req.params
    const module = await ModuleAssignment.findOne({moduleID,studentID});
    if (module){
      res.status(200).json(module.orderID);
    }else{
        res.status(400).json({value:"No module found"})
    }
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});    
    }
}