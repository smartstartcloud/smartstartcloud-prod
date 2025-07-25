import useApi from './useApi'

const useSendStudentData = () => {
    const api = useApi()
    const sendStudent = async ({
      degreeID,
      studentStatus,
      studentID,
      studentName,
      studentLogin,
      studentPassword,
      studentContact,
      studentOfficePassword,
      studentOther,
      groupName,
      tutorName,
      campusLocation,
      universityName,
      courseName,
      year,
      isExternal, // new field
    }) => {
      try {
        const res = await api.post(`/api/degree/addStudentInDegree`, {
          degreeID,
          studentStatus,
          studentID,
          studentName,
          studentLogin,
          studentPassword,
          studentContact,
          studentOfficePassword,
          studentOther,
          groupName,
          tutorName,
          campusLocation,
          universityName,
          courseName,
          year,
          isExternal,
        });

        const data = await res.data;
        if (data.error) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            console.log("Error: Student ID already exists");
            throw new Error("Student ID already exists");
          } else if (error.response.status === 500) {
            console.log("Error: Internal Server Error");
            throw new Error("Internal Server Error");
          } else {
            console.log("Error: ", error.response.data.error);
            throw new Error(error.response.data.error); // Re-throw any other error
          }
        } else {
          console.log("Network or other error", error);
          throw new Error("Something went wrong");
        }
      }
    };

    const updateStudent = async ({
      _id,
      degreeID,
      studentStatus,
      studentID,
      studentName,
      studentLogin,
      studentPassword,
      studentContact,
      studentOfficePassword,
      studentOther,
      groupName,
      tutorName,
      campusLocation,
      universityName,
      courseName,
      year,
      isExternal, // new field
    }) => {
      try {
        const res = await api.put(`/api/degree/updateStudentInDegree`, {
          _id,
          degreeID,
          studentStatus,
          studentID,
          studentName,
          studentLogin,
          studentPassword,
          studentContact,
          studentOfficePassword,
          studentOther,
          groupName,
          tutorName,
          campusLocation,
          universityName,
          courseName,
          year,
          isExternal,
        });

        const data = await res.data;
        if (data.error) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            console.log("Error: Student ID already exists");
            throw new Error("Student ID already exists");
          } else if (error.response.status === 500) {
            console.log("Error: Internal Server Error");
            throw new Error("Internal Server Error");
          } else {
            console.log("Error: ", error.response.data.error);
            throw new Error(error.response.data.error); // Re-throw any other error
          }
        } else {
          console.log("Network or other error", error);
          throw new Error("Something went wrong");
        }
      }
    };

    return { sendStudent, updateStudent }
}

export default useSendStudentData