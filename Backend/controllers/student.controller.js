import Student from '../models/student.models.js';

// Function to add new students and return their MongoDB ObjectIDs
export async function addNewStudent(studentList) {
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
