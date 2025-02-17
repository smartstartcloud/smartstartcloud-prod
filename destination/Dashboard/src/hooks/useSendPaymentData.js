import React from "react";
import useApi from "./useApi";

const useSendPaymentData = () => {
  const api = useApi();
//   const sendPayment = async ({
//     degreeID,
//     studentID,
//     studentName,
//     studentLogin,
//     studentPassword,
//     studentContact,
//   }) => {
//     try {
//       const res = await api.post(`/api/degree/addStudentInDegree`, {
//         degreeID,
//         studentID,
//         studentName,
//         studentLogin,
//         studentPassword,
//         studentContact,
//       });

//       const data = await res.data;
//       if (data.error) {
//         throw new Error(data.error);
//       }
//       return data;
//     } catch (error) {
//       if (error.response) {
//         if (error.response.status === 400) {
//           console.log("Error: Student ID already exists");
//           throw new Error("Student ID already exists");
//         } else if (error.response.status === 500) {
//           console.log("Error: Internal Server Error");
//           throw new Error("Internal Server Error");
//         } else {
//           console.log("Error: ", error.response.data.error);
//           throw new Error(error.response.data.error); // Re-throw any other error
//         }
//       } else {
//         console.log("Network or other error", error);
//         throw new Error("Something went wrong");
//       }
//     }
//   };

  const updatePayment = async (
    {
      totalPaymentDue,
      totalPaymentToDate,
      paymentMethod,
      paymentAmount,
      paymentStatus,
      paidAmount,
      otherPaymentMethod,
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
        paymentRequiredInformation,
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

  return { updatePayment };
};

export default useSendPaymentData;
