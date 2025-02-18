import React from "react";
import useApi from "./useApi";
import { useAuthContext } from "../context/AuthContext";

const useSendPaymentData = () => {
  const api = useApi();
  const { authUser } = useAuthContext();  
  const updatePayment = async (
    {
      totalPaymentDue,
      totalPaymentToDate,
      paymentMethod,
      paymentAmount,
      paymentStatus,
      paidAmount,
      otherPaymentMethod,
      bankPaymentMethod,
      cashPaymentMethod,
      referredPaymentMethod
    },
    paymentRequiredInformation
  ) => {    
    try {
      const res = await api.post(`/api/module/updatePaymentData`, {
        totalPaymentDue,
        totalPaymentToDate,
        paymentMethod,
        paymentAmount,
        paymentStatus,
        paidAmount,
        otherPaymentMethod,
        bankPaymentMethod,
        cashPaymentMethod,
        referredPaymentMethod,
        paymentRequiredInformation,
        userID: authUser._id
      });
      const data = await res.data;
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          console.log("Error: Internal Server Error");
          throw new Error("Internal Server Error");
        } else {
          console.log("Error: ", error.response.data.error);
          throw new Error(error.response.data.error); // Re-throw any other error
        }
      } else {
        console.log("Network or other error", error);
        throw new Error("Something went wrong");
      }
    }
  };

  const updatePaymentStatus = async (id, paymentVerificationStatus) => {
    try {      
      const res = await api.post(`/api/module/updatePaymentStatus`, {
        id, paymentVerificationStatus
      });
      const data = await res.data;
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          console.log("Error: Internal Server Error");
          throw new Error("Internal Server Error");
        } else {
          console.log("Error: ", error.response.data.error);
          throw new Error(error.response.data.error); // Re-throw any other error
        }
      } else {
        console.log("Network or other error", error);
        throw new Error("Something went wrong");
      }
    }
  };

  return { updatePayment, updatePaymentStatus };
};

export default useSendPaymentData;
