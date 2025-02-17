import useApi from "./useApi"

const useDeleteObjects = () => {
    const api = useApi()
    let res;
    const deleteAssignment = async (assignmentID) => {
        try {
            res = await api.delete(
              `/api/module/deleteAssignment/${assignmentID}`
            );
            const data = await res.data;
            if (data.error) {
                throw new Error(data.error);
            }
            return data;
        } catch (error) {
            if (error.response) {
                if (error.response.status === 500) {
                    console.log("Error: Internal Server Error");
                    throw new Error("Internal Server Error");
                }
            } else {
                console.log("Network or other error", error);
                throw new Error("Something went wrong");
            }
        }
        
    }

    const deleteDegree = async (degreeID) => {
      try {        
        res = await api.delete(`/api/degree/deleteDegree/${degreeID}`);
        const data = await res.data;
        if (data.error) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) {
            console.log("Error: Internal Server Error");
            throw new Error("Internal Server Error");
          }
        } else {
          console.log("Network or other error", error);
          throw new Error("Something went wrong");
        }
      }
    };

    const deleteStudent = async (studentID,degreeID) => {
      try {
        res = await api.delete(`/api/degree/deleteStudent/${studentID}/${degreeID}`);
        const data = await res.data;
        if (data.error) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) {
            console.log("Error: Internal Server Error");
            throw new Error("Internal Server Error");
          }
        } else {
          console.log("Network or other error", error);
          throw new Error("Something went wrong");
        }
      }
    };
    return { deleteAssignment, deleteStudent, deleteDegree };
}

export default useDeleteObjects