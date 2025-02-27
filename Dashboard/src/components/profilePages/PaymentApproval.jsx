import {
  Box,
  Typography,
  useTheme,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useAllGetPaymentDetails from "../../hooks/useGetAllPaymentDetails";
import useSendPaymentData from "../../hooks/useSendPaymentData";
import { useLocation } from "react-router-dom";
import PaymentApprovalTable from "../PaymentApprovalTable";

const PaymentApproval = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { paymentData, error, loading } = useAllGetPaymentDetails();
  const { updatePaymentStatus } = useSendPaymentData();
  const [tableData, setTableData] = useState([]);
  const [listBankFilter, setBankFilter] = useState([]);
  const [listCashFilter, setCashFilter] = useState([]);
  const [listReferralFilter, setReferralFilter] = useState([]);
  const [listOtherFilter, setOtherFilter] = useState([]);  

  const location = useLocation();
  const dataId = location.state?.dataId || null
  
  useEffect(() => {
    if (paymentData && paymentData.length > 0) {   
      setBankFilter([]);
      setCashFilter([]);
      setOtherFilter([]);
      setReferralFilter([]);
      setTableData([]); // Clear the table data array first
      // Then, populate it with the data from the API response  // This is where you would map over the paymentData array and create objects with the desired properties.
      paymentData.forEach((item) => {
        const tempObj = {
          id: item._id,
          studentID: item.studentID?.studentID,
          studentName: item.studentID?.studentName,
          degreeID: item.degreeID,
          degreeYear: item.degreeYear,
          degreeName: item.degreeName,
          moduleName: item.moduleName,
          modulePrice: item.modulePrice ? item.modulePrice : 0,
          paidAmount: item.paidAmount ? item.paidAmount : 0,
          paymentDue: item.totalPaymentDue ? item.totalPaymentDue : 0,
          paymentToDate: item.totalPaymentToDate,
          paymentMethod: item?.paymentMethod
            ? item.paymentMethod.toString().toUpperCase()
            : "",
          paymentMethodDetails:
            item.paymentMethod === "bank"
              ? item.bankPaymentMethod
              : item.paymentMethod === "cash"
              ? item.cashPaymentMethod
              : item.paymentMethod === "referral"
              ? item.referralPaymentMethod
              : item.paymentMethod === "other"
              ? item.otherPaymentMethod
              : null,
          userName: item.user?.userName,
          paymentVerificationStatus: item.paymentVerificationStatus,
        };
        if (item.paymentMethod === "bank") setBankFilter((prev) => [...prev, tempObj]);
        if (item.paymentMethod === "cash") setCashFilter((prev) => [...prev, tempObj]);
        if (item.paymentMethod === "referral") setReferralFilter((prev) => [...prev, tempObj]);
        if (item.paymentMethod === "other") setOtherFilter((prev) => [...prev, tempObj]);
      });
    }
  }, [paymentData]);

  // Handle row click to navigate to the student page using degreeYear, degreeId, and studentId
  const handleStatusUpdate = (value) => {
    console.log(value);

    if (value.paymentMethod === "CASH") {
      setCashFilter((prev)=> 
          prev.map((row)=> 
              row.id === value.id
                ? {
                    ...row,
                    paymentVerificationStatus:
                      row.paymentVerificationStatus === "awaiting approval"
                        ? "approved"
                        : "awaiting approval",
                  }
                : row
          )
      )
    }
    if (value.paymentMethod === "BANK") {
      setBankFilter((prev)=> 
          prev.map((row)=> 
              row.id === value.id
                ? {
                    ...row,
                    paymentVerificationStatus:
                      row.paymentVerificationStatus === "awaiting approval"
                        ? "approved"
                        : "awaiting approval",
                  }
                : row
          )
      )
    }
    if (value.paymentMethod === "REFERRAL") {
      setReferralFilter((prev)=> 
          prev.map((row)=> 
              row.id === value.id
                ? {
                    ...row,
                    paymentVerificationStatus:
                      row.paymentVerificationStatus === "awaiting approval"
                        ? "approved"
                        : "awaiting approval",
                  }
                : row
          )
      )
    }
    if (value.paymentMethod === "OTHER") {
      setOtherFilter((prev)=> 
          prev.map((row)=> 
              row.id === value.id
                ? {
                    ...row,
                    paymentVerificationStatus:
                      row.paymentVerificationStatus === "awaiting approval"
                        ? "approved"
                        : "awaiting approval",
                  }
                : row
          )
      )
    }
    
    updatePaymentStatus(value.id, value.paymentVerificationStatus === "awaiting approval"?"approved":"awaiting approval");
    // setTableData((prev)=> 
    //     prev.map((row)=> 
    //         row.id === value.id
    //           ? {
    //               ...row,
    //               paymentVerificationStatus:
    //                 row.paymentVerificationStatus === "awaiting approval"
    //                   ? "approved"
    //                   : "awaiting approval",
    //             }
    //           : row
    //     )
    // )
  };

  const columns = [
    { field: "studentID", headerName: "sID", flex: 0.25 },
    { field: "studentName", headerName: "Student Name", flex: 0.5 },
    { field: "degreeID", headerName: "Degree ID", flex: 0.5 },
    { field: "degreeYear", headerName: "Degree Year", flex: 0.5 },
    { field: "degreeName", headerName: "Degree Name", flex: 0.5 },
    { field: "moduleName", headerName: "Module Name", flex: 0.5 },
    { field: "modulePrice", headerName: "Module Price", flex: 0.5 },
    { field: "paidAmount", headerName: "Paid Amount", flex: 0.5 },
    { field: "paymentDue", headerName: "Payment Due", flex: 0.5 },
    { field: "paymentToDate", headerName: "Payment To Date", flex: 0.5 },
    { field: "paymentMethod", headerName: "Payment Method", flex: 0.5 },
    { field: "paymentMethodDetails", headerName: "Details", flex: 0.5 },
    { field: "userName", headerName: "Employee", flex: 0.5 },
    {
      field: "paymentVerificationStatus",
      headerName: "Verification Status",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant={
            params.row.paymentVerificationStatus !== "approved"
              ? "outlined"
              : "contained"
          }
          color={
            params.row.paymentVerificationStatus !== "approved"
              ? "error"
              : "success"
          }
          onClick={(event) => {
            event.stopPropagation(); // Prevents the row click event
            handleStatusUpdate(params.row);            
          }}
        >
          {params.row.paymentVerificationStatus}
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        mt="200px"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={150} sx={{ color: colors.blueAccent[100] }} />
      </Box>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <Box m="20px">
      <Header
        title={`All Payments`}
        subtitle="Here are all the payment to be approved"
      />
      {listBankFilter.length > 0 && (
        <PaymentApprovalTable
          list={listBankFilter}
          columns={columns}
          listName={"BANK"}
          dataId={dataId}
        />
      )}
      {listCashFilter.length > 0 && (
        <PaymentApprovalTable
          list={listCashFilter}
          columns={columns}
          listName={"CASH"}
          dataId={dataId}
        />
      )}
      {listReferralFilter.length > 0 && (
        <PaymentApprovalTable
          list={listReferralFilter}
          columns={columns}
          listName={"REFFERRAL"}
          dataId={dataId}
        />
      )}
      {listOtherFilter.length > 0 && (
        <PaymentApprovalTable
          list={listOtherFilter}
          columns={columns}
          listName={"OTHER"}
          dataId={dataId}
        />
      )}
    </Box>
  );
};

export default PaymentApproval;
