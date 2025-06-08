import useApi from './useApi';
import { useEffect, useState } from "react";

const useFetchModuleData = (degreeId, moduleId) => {
    const api = useApi();
    const [moduleData, setModuleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchModuleData = async (degreeId, moduleId) => {        
        try {
            const res = await api.get(
              `/api/module/getModuleData/${degreeId}/${moduleId}`
            );            
            setModuleData(res.data); // Update state with the degree data
            setLoading(false); // Mark as not loading anymore
        } catch (error) {
            console.error("Error fetching degree data: ", error);
            setError(error);
            setLoading(false); // Even if there's an error, stop the loading state
        }
        };

        fetchModuleData(degreeId, moduleId); // Call the async function within useEffect
    }, []);

    return { moduleData, loading, error };
}

export default useFetchModuleData