import Student from '../models/student.models.js';

// Function to add new students and return their MongoDB ObjectIDs
async function addNewStudent(studentList) {
  try {
    // Array to store the ObjectIDs of the newly added students
    const addedStudentIDs = [];

    // Iterate over the studentList array and add each student to the database
    for (const studentData of studentList) {
      // Create a new Student instance
      const newStudent = new Student({
        studentName: studentData.studentName,
        studentID: studentData.studentID,
        studentContact: studentData.studentContact,
        studentLoginUsername: studentData.studentLoginUsername,
        studentLoginPassword: studentData.studentLoginPassword,
        studentAssignment: studentData.studentAssignment || []
      });

      // Save the student to the database and get the saved student's MongoDB ObjectID
      const savedStudent = await newStudent.save();
      
      // Add the saved student's MongoDB ObjectID to the array
      addedStudentIDs.push(savedStudent._id);
    }

    // Return the array of added students' MongoDB ObjectIDs
    return addedStudentIDs;
  } catch (error) {
    console.error('Error adding new students:', error);
    throw new Error('Error adding new students');
  }
}

// Update your newDegree function to use the addNewStudent function
export const newDegree = async (req, res) => {
  try {
    const { dID, name, year, user, studentList, modules } = req.body;

    // Run addNewStudent function with the studentList
    const addedStudentList = await addNewStudent(studentList);

    // Create the new Degree instance with the MongoDB ObjectIDs for studentList
    const newDegree = new Degree({
      dID,
      name,
      year,
      user,
      studentList: addedStudentList, // Use the ObjectIDs
      modules
    });

    // Save the new degree
    if (newDegree) {
      await newDegree.save();
      res.send(addedStudentList); // Send back the ObjectIDs
    }
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: 'Degree ID already exists' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};


