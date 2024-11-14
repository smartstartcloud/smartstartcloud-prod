import useApi from "./useApi"

const useDeleteDegrees = () => {
    const api = useApi()
    let res;
    const deleteDegree = async (degreeID) => {
        try {
            res = await api.delete(
              `/api/module/deleteDegree/${degreeID}`
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
    return {deleteDegree}
}



export default useDeleteDegrees