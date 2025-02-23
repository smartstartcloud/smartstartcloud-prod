import { useEffect, useState } from "react";
// import { api } from '../utils/axiosInstance';
import useApi from "./useApi";

const useFetchAllActionLogs = () => {
  const api = useApi();
  const [logList, setLogList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const AllActionLogs = async () => {
      try {
        const res = await api.get(`/api/log/AllLogs`);
        
        setLogList(res.data.data); // Update state with the Agent data
        setLoading(false); // Mark as not loading anymore
      } catch (error) {
        console.error("Error fetching log data: ", error.response.data.error);
        setError(error.response.data.error);
        setLoading(false); // Even if there's an error, stop the loading state
      }
    };

    AllActionLogs(); // Call the async function within useEffect
  }, []);
  return { logList, loading, error };
};

export default useFetchAllActionLogs;
