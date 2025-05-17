import useApi from "./useApi"

const useFetchPaymentWithDegree = () => {
    const api = useApi()
    const fetchPaymentWithDegree = async (degreeID, studentID) => {        
      try {        
        const res = await api.get(
          `/api/module/getPaymentDataWithDegree/${degreeID}/${studentID}`
        );
        const data = res.data;
        return data
      } catch (error) {
        if (error.response) {
            console.log(error.response.data.message);
            throw new Error(error.response.data.message);
        } else {
          console.log("Network or other error", error);
          throw new Error("Something went wrong");
        }
      }
    };
    
    return {fetchPaymentWithDegree}
}

export default useFetchPaymentWithDegree