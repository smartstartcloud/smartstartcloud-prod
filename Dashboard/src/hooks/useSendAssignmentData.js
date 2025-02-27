import useApi from "./useApi"

const useSendAssignmentData = () => {
    const api = useApi()
    let res;
    const sendAssignment = async({assignmentID, studentID, moduleCode, orderID, assignmentName, assignmentType, assignmentProgress, assignmentDeadline, wordCount, assignmentGrade}, editMode) => {        
        try {
            if (editMode) {
                res = await api.put(
                  `/api/module/updateAssignment/${assignmentID}`,
                  {
                    moduleCode,
                    orderID,
                    assignmentName,
                    assignmentType,
                    assignmentProgress,
                    assignmentDeadline,
                    wordCount,
                    assignmentGrade,
                  }
                );

            } else {
                res = await api.post(`/api/module/newAssignment`, {
                  studentID,
                  moduleCode,
                  orderID,
                  assignmentName,
                  assignmentType,
                  assignmentProgress,
                  assignmentDeadline,
                  wordCount,
                  assignmentGrade,
                });
            }
            const data = await res.data;
            if (data.error) {
                throw new Error(data.error);
            }
            return data
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    console.log("Error: Order ID already exists");
                    throw new Error("Order ID already exists");
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
        
    }

    const updateOrderID = async ({ assignmentID, newValue, tStatus }) => {
      
      try {
        if (tStatus === "orderID") {
          res = await api.put(`/api/module/updateAssignment/${assignmentID}`, {
            orderID: newValue,
          });
        } else if (tStatus === "progress") {
          res = await api.put(`/api/module/updateAssignment/${assignmentID}`, {
            assignmentProgress: newValue,
          });
        } else if (tStatus === "grade") {
          res = await api.put(`/api/module/updateAssignment/${assignmentID}`, {
            assignmentGrade: newValue,
          });
        }
        const data = await res.data;
        if (data.error) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            console.log("Error: Order ID already exists");
            throw new Error("Order ID already exists");
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

    return {sendAssignment, updateOrderID}
  
}

export default useSendAssignmentData