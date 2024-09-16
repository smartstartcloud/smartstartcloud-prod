import Student from '../models/student.models.js';

// Function to add new students and return their MongoDB ObjectIDs
export async function addNewStudent(studentList) {
  try {
    // Use Promise.all to save all students concurrently
    const addedStudentIDs = await Promise.all(
      studentList.map(async (studentData) => {
        // Create a new Student instance
        const newStudent = new Student({
          studentName: studentData.studentName,
          studentID: studentData.studentID,
          studentContact: studentData.studentContact,
          studentLogin: studentData.studentLogin, // Corrected field name
          studentPassword: studentData.studentPassword, // Corrected field name
          studentAssignment: studentData.studentAssignment || [] // Default to empty array
        });

        // Save the student to the database and return the saved student's ObjectID
        const savedStudent = await newStudent.save();
        return savedStudent._id;
      })
    );

    return addedStudentIDs; // Return the array of added student IDs
  } catch (error) {
    console.error("Error adding students:", error);
    throw new Error('Failed to add students');
  }
}



