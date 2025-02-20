import { useEffect, useState } from "react";
// import { api } from '../utils/axiosInstance';
import useApi from "./useApi";

const useFetchAllAgentData = () => {
    const api = useApi();
    const [agentList, setAgentList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchAgentData = async () => {
        try {          
          const res = await api.get(`/api/degree/agent/all`);               
          setAgentList(res.data); // Update state with the Agent data
          setLoading(false); // Mark as not loading anymore
        } catch (error) {
          console.error("Error fetching Agent data: ", error);
          setError(error);
          setLoading(false); // Even if there's an error, stop the loading state
        }
      };

      fetchAgentData(); // Call the async function within useEffect
    }, []);
    return { agentList, loading, error };
};

export default useFetchAllAgentData;
