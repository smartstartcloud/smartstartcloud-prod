import { useEffect, useState } from "react";
// import { api } from '../utils/axiosInstance';
import useApi from "./useApi";

const useFetchStudentAllLogs = (studentId) => {
  const api = useApi();
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentAllLogs = async (studentId) => {
      try {
        // Get degree by DegreeID
        const res = await api.get(`/api/degree/logs/studentID/${studentId}`);

        setLogs(res.data); // Update state with the degree data
        setLoading(false); // Mark as not loading anymore
      } catch (error) {
        console.error("Error fetching student data: ", error);
        setError(error);
        setLoading(false); // Even if there's an error, stop the loading state
      }
    };

    fetchStudentAllLogs(studentId); // Call the async function within useEffect
  }, [studentId]);
  return { logs, loading, error };
};

export default useFetchStudentAllLogs;
