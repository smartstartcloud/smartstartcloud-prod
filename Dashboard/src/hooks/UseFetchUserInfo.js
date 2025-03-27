import { useEffect, useState } from "react";
import useApi from "./useApi";

const useFetchUserInfo = (userId) => {
  const api = useApi();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/auth/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return { user, loading, error };
};

export default useFetchUserInfo;
