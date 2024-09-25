import axios from 'axios'
import { useEffect, useState } from 'react';
import { api } from '../utils/axiosInstance';


const useFetchSingleDegreeData = (degreeId) => {
    const [degree, setDegree] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
            const fetchDegreeData = async (degreeId) => {
            try {
                // Get degree by DegreeID
                const res = await api.get(`${process.env.REACT_APP_LOCALHOST}/api/degree/selected/degreeID/${degreeId}`, {
                headers: {
                    "Content-Type": "application/json"
                }
                });
                setDegree(res.data); // Update state with the degree data
                setLoading(false);   // Mark as not loading anymore
            } catch (error) {
                console.error("Error fetching degree data: ", error);
                setError(error);
                setLoading(false); // Even if there's an error, stop the loading state
            }
        };

        fetchDegreeData(degreeId); // Call the async function within useEffect
    }, [degreeId]);

  return {degree, loading, error}


}

export default useFetchSingleDegreeData