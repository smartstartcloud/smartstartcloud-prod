import useApi from "./useApi";

const useSendMarkNotificationAsRead = () => {
  const api = useApi();
  const sendMarkNotificationAsRead = async (notificationId, userId) => {
    try {
      if (!notificationId || !userId) {
        throw new Error("Missing notificationId or userId");
      }
      const res = await api.post(
        `/api/notification/sendMarkNotificationAsRead`,
        { notificationId, userId }
      );

      const data = await res.data;
      console.log(data);
      return data;
    } catch (error) {
        console.log(error.response.data.error);
        
    }
  };

  return { sendMarkNotificationAsRead };
};

export default useSendMarkNotificationAsRead;
