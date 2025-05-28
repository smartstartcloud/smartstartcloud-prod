export const addNewStudentLog = async({studentData, userID, userName, action, involvedData}) => {
    console.log(studentData, userID, userName, actionTypes[action], involvedData);
}

const actionTypes = {
  newStudentDynamic: "Student Created Dynamically.",
  updateStudentDynamic: "Student is Updated Dynamically",
  newStudentManual: "Student Created Manually.",
  updateStudentManual: "Student is Updated Manually",
  newAssignmentDynamic: "Assignment Created Dynamically.",
  newAssignmentManual: "Assignment Created Manually.",
};