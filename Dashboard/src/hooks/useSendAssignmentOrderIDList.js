import useApi from "./useApi"

const useSendAssignmentOrderIDList = () => {
    const api = useApi()
    const sendAssignmentOrderIDList = async(assignmentOrderPairs) => {    
        console.log("Assignment Order Pairs:", assignmentOrderPairs)
        try {
            if (!assignmentOrderPairs.length) {
              throw new Error("Order ID Empty");
            }
            const res = await api.post(`/api/module/linkAssignmentOrderID`, { assignmentOrderPairs });

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
                } else if (error.response.status === 404) {
                console.log("Error: Order ID Empty");
                throw new Error("Order ID Empty");
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

    return {sendAssignmentOrderIDList}
}

export default useSendAssignmentOrderIDList