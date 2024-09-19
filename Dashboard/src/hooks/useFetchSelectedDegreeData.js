import axios from 'axios'
import { useEffect, useState } from 'react';

const useFetchSelectedDegreeData = (degreeYear) => {
    const [degree, setDegree] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
            const fetchDegreeData = async (degreeYear) => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_LOCALHOST}/api/degree/selected/year/${degreeYear}`, {
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

        fetchDegreeData(degreeYear); // Call the async function within useEffect
    }, [degreeYear]);

  return {degree, loading, error}


}

export default useFetchSelectedDegreeData