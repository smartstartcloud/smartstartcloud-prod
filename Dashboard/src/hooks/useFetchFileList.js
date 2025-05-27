import { useEffect, useState } from 'react'
import useApi from './useApi';

const useFetchFileList = (referenceID, isOrder, orderID, parentID) => {  
    const api = useApi()
    const [fileList, setFileList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchFileList = async (referenceID, isOrder, orderID, parentID) => {
        try {
          const res = await api.post(`/api/files/list/singleFile/getList`, { referenceID, isOrder, orderID, parentID  });

          setFileList(res.data); // Update state with the degree data
          setLoading(false); // Mark as not loading anymore
        } catch (error) {
          console.error("Error fetching file list: ", error.response.data);
          setError(error);
          setLoading(false); // Even if there's an error, stop the loading state
        }
      };

      fetchFileList(referenceID, isOrder, orderID, parentID); // Call the async function within useEffect
    }, [referenceID, isOrder, orderID, parentID]);

  return {fileList, loading, error}
}

export default useFetchFileList