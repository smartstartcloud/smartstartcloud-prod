import { useState, useEffect } from "react";
import useApi from "./useApi"; // Adjust the import as necessary

const useGlobalSearch = (searchQuery) => {  
  const api = useApi();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {    
    const fetchGlobalSearch = async () => {        
      try {
        const res = await api.get(
          `/api/search?query=${encodeURIComponent(searchQuery)}`
        );
        // Assuming the response structure is: { success: true, results: { users, degrees, modules, assignments } }
        setResults(res.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching global search results: ", error);
        setError(error);
        setLoading(false);
      }
    };

    if (searchQuery && searchQuery.trim() !== "") {
      setLoading(true);
      fetchGlobalSearch();
    } else {
      setResults(null);
      setLoading(false);
    }
  }, [searchQuery]);

  return { results, loading, error };
};

export default useGlobalSearch;
