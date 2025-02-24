import React from "react";
import useApi from "./useApi";
import { useEffect, useState } from "react";

const useFetchModuleAssignmentData = (studentId, moduleId) => {    
  const api = useApi();
  const [moduleAssignmentData, setModuleAssignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModuleAssignmentData = async (studentId, moduleId) => {
      try {
        const res = await api.get(
          `/api/module/getModuleAssignmentData/${studentId}/${moduleId}`
        );
        setModuleAssignmentData(res.data); // Update state with the degree data
        setLoading(false); // Mark as not loading anymore
      } catch (error) {
        console.error("Error fetching ModuleAssignmentData data: ", error.response.data.error);
        setError(error);
        setLoading(false); // Even if there's an error, stop the loading state
      }
    };

    fetchModuleAssignmentData(studentId, moduleId); // Call the async function within useEffect
  }, [studentId, moduleId]);

  return { moduleAssignmentData, loading, error };
};

export default useFetchModuleAssignmentData;
