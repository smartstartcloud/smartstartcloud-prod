import { useEffect, useState } from "react";
import useApi from "./useApi";

const useFetchAllStudentData = () => {
    const api = useApi();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchStudentData = async () => {
        try {          
          const res = await api.get(`/api/degree/student/all`);          
          setStudent(res.data); // Update state with the Student data
          setLoading(false); // Mark as not loading anymore
        } catch (error) {
          console.error("Error fetching student data: ", error);
          setError(error);
          setLoading(false); // Even if there's an error, stop the loading state
        }
      };

      fetchStudentData(); // Call the async function within useEffect
    }, []);
    return { student, loading, error };
};

export default useFetchAllStudentData;
