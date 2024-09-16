import Student from '../models/student.models.js'

export async function addNewStudent(studentList){
    let addedStudentList=[];
    try{
        for(let i of studentList){
            const newStudent = new Student({
                studentName: i.sName,
                studentID: i.sID,
                studentContact: i.contact,
                studentLogin: i.sLogin,
                studentPassword: i.sPassword,
                studentAssignment: i.assignment
              })
              if(newStudent){
                await newStudent.save().then((data)=>{
                    addedStudentList.push(data.id);
                });
              }
        }
    }catch(error){
        console.log(error);
    }
    return addedStudentList;
  }
