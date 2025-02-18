import { useEffect, useState } from "react";
import useApi from "./useApi";

const useGetPaymentDetails = (paymentInfo) => {
  const api = useApi();
  const [paymentData, setpaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentData = async (paymentInfo) => {
      try {
        const res = await api.post(`/api/module/getPaymentData`, { ...paymentInfo });
        setpaymentData(res.data); // Update state with the degree data        
        setLoading(false); // Mark as not loading anymore        
      } catch (error) {
        console.error("Error fetching payment data: ", error);
        setError(error);
        setLoading(false); // Even if there's an error, stop the loading state
      }
    };

    fetchPaymentData(paymentInfo); // Call the async function within useEffect
  }, [paymentInfo]);

  return { paymentData };
};

export default useGetPaymentDetails;
