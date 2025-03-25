import axios from "axios";
import { useEffect, useState } from "react";
// import { api } from '../utils/axiosInstance';
import useApi from "./useApi";

const useFetchUserInfo = (userId) => {
  const api = useApi();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async (userId) => {
      try {
        // Get user by userID
        const res = await api.get(`/api/user/selected/userID/${userId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setUser(res.data); // Update state with the user data
        setLoading(false); // Mark as not loading anymore
      } catch (error) {
        console.error("Error fetching user data: ", error);
        setError(error);
        setLoading(false); // Even if there's an error, stop the loading state
      }
    };

    fetchUserInfo(userId); // Call the async function within useEffect
  }, [userId]);

  return { user, loading, error };
};

export default useFetchUserInfo;
