import Student from '../models/student.models.js';
import Degree from '../models/degree.models.js'

export async function getAllStudents(req, res) {
  try {
    // Find all students and return them
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    throw new Error("Failed to fetch students");
  }
}
// Function to add new students and return their MongoDB ObjectIDs
export async function addNewStudent(studentList, parentLink) {
  try {
    // Use Promise.all to save all students concurrently
    const addedStudentIDs = await Promise.all(
      studentList.map(async (studentData) => {
        // Finding the current student in database to see if the ID already exists in database;
        let currentStudent = await Student.findOne({
          studentID: studentData.studentID,
        });
        if (currentStudent) {          
          // Update the current student with the new data
          const updatedStudent = await Student.findOneAndUpdate(
            { _id: currentStudent._id }, // Find the student by studentID
            {
              studentName: studentData.studentName,
              studentID: studentData.studentID,
              studentContact: studentData.studentContact,
              studentLogin: studentData.studentLogin,
              studentPassword: studentData.studentPassword,
              studentOfficePassword: studentData.studentOfficePassword,
              studentOther: studentData.studentOther,
              groupName: studentData.groupName,
              tutorName: studentData.tutorName,
              campusLocation: studentData.campusLocation,
              universityName: studentData.universityName,
              courseName: studentData.courseName,
              year: studentData.year,
              isExternal: studentData.isExternal,
              studentAssignment: studentData.studentAssignment || [],
            },
            { new: true } // Return the updated document
          );
          return updatedStudent._id;
        } else {
          const homeLink = parentLink;
          // Create a new Student instance
          const newStudent = new Student({
            studentName: studentData.studentName,
            studentID: studentData.studentID,
            studentContact: studentData.studentContact,
            studentLogin: studentData.studentLogin,
            studentPassword: studentData.studentPassword,
            studentOfficePassword: studentData.studentOfficePassword,
            studentOther: studentData.studentOther,
            groupName: studentData.groupName,
            tutorName: studentData.tutorName,
            campusLocation: studentData.campusLocation,
            universityName: studentData.universityName,
            courseName: studentData.courseName,
            year: studentData.year,
            isExternal: studentData.isExternal,
            studentAssignment: studentData.studentAssignment || [],
          });

          // Save the student to the database and return the saved student's ObjectID
          const savedStudent = await newStudent.save();
          // Update metadata with _id and save again
          savedStudent.metadata = {
            goTo: `${homeLink}`,
            dataId: savedStudent._id,
          };
          await savedStudent.save();
          return savedStudent._id;
        }
      })
    );

    return addedStudentIDs; // Return the array of added student IDs
  } catch (error) {
    console.error("Error adding students:", error);
    throw new Error("Failed to add students");
  }
}

export const addStudentInDegree = async (req, res) => {
  try {
    const {
      degreeID,
      studentName,
      studentID,
      studentContact,
      studentLogin,
      studentPassword,
      studentOfficePassword,
      studentOther,
      groupName,
      tutorName,
      campusLocation,
      universityName,
      courseName,
      year,
      isExternal,
      studentAssignment, // optional
    } = req.body;

    // 1. Check if degree exists before anything else
    const degree = await Degree.findOne({ degreeID });
    if (!degree) {
      return res.status(404).json({ error: "Degree not found" });
    }

    // 2. Check for existing student ID
    const existingStudent = await Student.findOne({ studentID });
    if (existingStudent) {
      return res.status(400).json({ error: "Student ID already exists" });
    }

    // 3. Create and save new student
    const newStudent = new Student({
      studentName,
      studentID,
      studentContact,
      studentLogin,
      studentPassword,
      studentOfficePassword,
      studentOther,
      groupName,
      tutorName,
      campusLocation,
      universityName,
      courseName,
      year,
      isExternal,
      studentAssignment: studentAssignment || [],
    });

    const savedStudent = await newStudent.save();

    // 4. Update degree with student ID
    degree.degreeStudentList.push(savedStudent._id);
    await degree.save();

    // 5. Update student's metadata with degree info
    savedStudent.metadata = {
      goTo: degree?.metadata?.goTo || "",
      dataId: savedStudent._id,
    };
    await savedStudent.save();

    return res.status(200).json({ value: "Student added successfully" });
  } catch (error) {
    console.error("Error adding student:", error);
    return res.status(500).json({ error: "Failed to add student" });
  }
};


export const updateStudentInDegree = async (req, res) => {
  try {
    const {
      _id, // Required for updating an existing student
      degreeID,
      studentName,
      studentID,
      studentContact,
      studentLogin,
      studentPassword,
      studentOfficePassword,
      studentOther,
      groupName,
      tutorName,
      campusLocation,
      universityName,
      courseName,
      year,
      isExternal,
      studentAssignment, // Optional
    } = req.body;

    // Ensure _id is provided
    if (!_id) {
      return res
        .status(400)
        .json({ error: "Student _id is required for updating." });
    }

    // Check if the student exists
    let currentStudent = await Student.findById(_id);
    if (!currentStudent) {
      return res.status(404).json({ error: "Student not found." });
    }

    // Update only provided fields
    const updatedFields = {};
    if (studentName) updatedFields.studentName = studentName || "";
    if (studentID) updatedFields.studentID = studentID || "";
    if (studentContact) updatedFields.studentContact = studentContact || "";
    if (studentLogin) updatedFields.studentLogin = studentLogin || "";
    if (studentPassword) updatedFields.studentPassword = studentPassword || "";
    if (studentOfficePassword)
      updatedFields.studentOfficePassword = studentOfficePassword || "";
    if (studentOther) updatedFields.studentOther = studentOther || "";
    if (groupName) updatedFields.groupName = groupName || "";
    if (tutorName) updatedFields.tutorName = tutorName || "";
    if (campusLocation) updatedFields.campusLocation = campusLocation || "";
    if (universityName) updatedFields.universityName = universityName || "";
    if (courseName) updatedFields.courseName = courseName || "";
    if (year) updatedFields.year = year || "";
    if (isExternal !== undefined) updatedFields.isExternal = isExternal;
    if (studentAssignment) updatedFields.studentAssignment = studentAssignment || "";

    // Update student in the database
    const updatedStudent = await Student.findByIdAndUpdate(
      _id,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(500).json({ error: "Failed to update student." });
    }

    // If degreeID is provided, ensure the student is linked correctly
    if (degreeID) {
      await Degree.findOneAndUpdate(
        { degreeID },
        { $addToSet: { degreeStudentList: updatedStudent._id } } // Prevents duplicates
      );
    }

    res
      .status(200)
      .json({
        message: "Student updated successfully",
        student: updatedStudent,
      });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
