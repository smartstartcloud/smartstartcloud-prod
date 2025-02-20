import { useEffect, useState } from "react";
import useApi from "./useApi";

const useFetchAllNotifications = (userId) => {
  const api = useApi();
  const [notificationList, setNotificationList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllNotifications = async (userId) => {
      try {
        if (!userId) {
          throw new Error("User ID is required");
        }
        const res = await api.post(`/api/notification/FetchNewNotification`, {
          userId,
        });
        const data = res.data;

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch notifications");
        }
        setNotificationList(data.notifications);
        setLoading(false);
      } catch (error) {
        if (error.response) {
          setError(error.response);
        } else {
          console.error("Error fetching Notification data: ", error);
          setError(error);
        }
        setLoading(false);
      }
    };
     if (userId){
        fetchAllNotifications(userId);
     }
  }, [userId]);

  return { notificationList, loading, error };
};

export default useFetchAllNotifications;
