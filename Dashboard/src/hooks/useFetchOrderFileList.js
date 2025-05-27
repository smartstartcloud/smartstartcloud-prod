import { useEffect, useState } from "react";
import useApi from "./useApi";

const useFetchOrderFileList = (orderID, isOrder) => {
  const api = useApi();
  const [fileList, setFileList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderFileList = async (orderID, isOrder) => {
      try {
        const res = await api.post(`/api/files/list/singleFile/getList`, {
          orderID, isOrder,
        });

        setFileList(res.data); // Update state with the degree data
        setLoading(false); // Mark as not loading anymore
      } catch (error) {
        console.error("Error fetching file list: ", error.response.data);
        setError(error);
        setLoading(false); // Even if there's an error, stop the loading state
      }
    };

    fetchOrderFileList(orderID, isOrder); // Call the async function within useEffect
  }, [orderID, isOrder]);

  return { fileList, loading, error };
};

export default useFetchOrderFileList;
