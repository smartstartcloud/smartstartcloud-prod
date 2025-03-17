import { useEffect, useState } from "react";
import useApi from "./useApi";

// Status can take these values only "awaiting approval", "approved", "rejected", "all"
const useAllGetPaymentDetails = (status='all') => {
  const api = useApi();
  const [paymentData, setpaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  

  useEffect(() => {
    const fetchAllPaymentData = async () => {
      try {
        const res = await api.get(
          `/api/module/getPaymentData/all?verificationStatus=${status}`
        );
        setpaymentData(res.data); // Update state with the degree data
        setLoading(false); // Mark as not loading anymore
      } catch (error) {
        console.error("Error fetching payment data: ", error);
        setError(error);
        setLoading(false); // Even if there's an error, stop the loading state
      }
    };

    fetchAllPaymentData(); // Call the async function within useEffect
  }, []);

  return { paymentData, loading, error };
};

export default useAllGetPaymentDetails;
