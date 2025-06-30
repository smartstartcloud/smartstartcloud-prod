import useApi from './useApi';

const useSendDegreeForm = () => {
    const api = useApi()

    const sendDegreeForm = async({_id=null, degreeID, degreeYear, degreeName, degreeAgent, degreeStudentList, degreeModules}, editMode=null) => {        
        try {
            let res;
            if (editMode) {
                res = await api.put(
                  `/api/degree/updateDegree/${_id}`,
                  {
                    degreeID,
                    degreeYear,
                    degreeName,
                    degreeAgent,
                    degreeStudentList,
                    degreeModules,
                  },
                  {
                    headers: { "Content-Type": "application/json" },
                  }
                );
            } 
            else {
                res = await api.post(`/api/degree/new`, {
                degreeID,
                degreeYear, 
                degreeName, 
                degreeAgent, 
                degreeStudentList, 
                degreeModules
            }, {
                headers: {"Content-Type": "application/json"}
            })}

            const data = res.data;
            if (data.error) {
                throw new Error(data.error);
            }
            return data
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 409) {
                    console.log("Error: Degree ID already exists");
                    throw new Error("Degree ID already exists");
                } else if (status === 500) {
                    console.log("Error: Internal Server Error");
                    throw new Error(data?.error || "Internal Server Error");
                } else {
                    console.log("Error: ", data?.error);
                    throw new Error(data?.error || "Internal Server Error"); // Re-throw any other error
                }
            } else {
                console.log("Network or other error", error);
                throw new Error("Something went wrong");
            }
        }
    }

    return {sendDegreeForm};
}

export default useSendDegreeForm