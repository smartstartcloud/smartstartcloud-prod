import useApi from "./useApi"

const useDeleteStudents = () => {
    const api = useApi()
    let res;
    const deleteStudent = async (studentID) => {
        try {
            res = await api.delete(
              `/api/module/deleteStudent/${studentID}`
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
    return {deleteStudent}
}



export default useDeleteStudents