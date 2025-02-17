import React, { useEffect, useState } from 'react'
import useApi from './useApi';

const useFetchFileList = (referenceID, isOrder, orderID) => {  
    const api = useApi()
    const [fileList, setFileList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchFileList = async (referenceID, isOrder, orderID) => {
        try {
          const res = await api.post(`/api/files/list/singleFile/getList`, { referenceID, isOrder, orderID  });

          setFileList(res.data); // Update state with the degree data
          setLoading(false); // Mark as not loading anymore
        } catch (error) {
          console.error("Error fetching file list: ", error.response.data);
          setError(error);
          setLoading(false); // Even if there's an error, stop the loading state
        }
      };

      fetchFileList(referenceID, isOrder, orderID); // Call the async function within useEffect
    }, [referenceID, isOrder, orderID]);

  return {fileList, loading, error}
}

export default useFetchFileList