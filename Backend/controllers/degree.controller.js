import Degree from '../models/degree.models.js'

//WRITE THE FUNCTION TO ADD NEW STUDENTS 
function addNewStudent(studentList){

  return //MongoID of added students as an array
}

export const newDegree = async (req,res)=>{
  try{
    const dID = req.body.dID;
    const name = req.body.name;
    const year = req.body.name;
    const user = req.body.user;
    const studentList = req.body.studentList;
    const modules = req.body.modules;

    //RUN addNewStudent() FUNCTION HERE WITH "studentList"
    const addedStudentList = addNewStudent(studentList)


    // Create User
    const newDegree = new Degree({
      dID,
      name,
      year,
      user,
      studentList:addedStudentList,
      modules
    })
    if(newDegree){
      await newDegree.save();
      res.send(addedStudentList);
    }
    }catch(error){
      if(error.code==11000){
        res.status(409).json({error:"Degree ID already exists"});
      }else{
        res.status(500).json({error:"Internal Server Error"});
      }
    }
}
