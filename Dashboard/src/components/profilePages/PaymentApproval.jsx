import {
  Box,
  useTheme,
  CircularProgress,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import useAllGetPaymentDetails from "../../hooks/useGetAllPaymentDetails";
import useSendPaymentData from "../../hooks/useSendPaymentData";
import useDeletePayment from "../../hooks/useDeleteObjects";
import { useLocation } from "react-router-dom";
import PaymentApprovalTable from "../PaymentApprovalTable";
import FileView from "../FileView";
import { useAuthContext } from "../../context/AuthContext";
import { formatDateString } from "../../utils/yearFilter";
import { format } from "date-fns";

const PaymentApproval = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {authUser} = useAuthContext()
  const { paymentData, error, loading } = useAllGetPaymentDetails();
  const { updatePaymentStatus } = useSendPaymentData();
  const { deletePayment } = useDeletePayment();
  const [tableData, setTableData] = useState([]);
  const [listBankFilter, setBankFilter] = useState([]);
  const [listCashFilter, setCashFilter] = useState([]);
  const [listReferralFilter, setReferralFilter] = useState([]);
  const [listOtherFilter, setOtherFilter] = useState([]);  
  const [fileViewModalOpen, setFileViewModalOpen] = useState(false);
  const [filesToSend, setFilesToSend] = useState([]);
  const [dataToSend, setDataToSend] = useState({});

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
          moduleAssignmentID: item.moduleAssignmentID,
          financeID: item.financeID,
          studentID: item.studentID?.studentID,
          studentName: item.studentID?.studentName,
          degreeID: item.degreeID,
          degreeYear: item.degreeYear,
          degreeName: item.degreeName,
          moduleName: item.moduleName,
          paymentNote: item.note,
          files: item.files,
          modulePrice: item.modulePrice ? item.modulePrice : 0,
          paidAmount: item.paidAmount ? item.paidAmount : 0,
          paymentDue: item.totalPaymentDue ? item.totalPaymentDue : 0,
          paymentToDate: item.totalPaymentToDate,
          paymentMethod: item.paymentMethod,
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
          bankPayeeName: item.paymentMethod === "bank" ? item.bankPayeeName : null,
          userName: item.user?.userName,
          paymentVerificationStatus: item.paymentVerificationStatus,
          approvalNoteLog: item.approvalNoteLog,
        };
        if (item.paymentMethod === "bank") setBankFilter((prev) => [...prev, tempObj]);
        if (item.paymentMethod === "cash") setCashFilter((prev) => [...prev, tempObj]);
        if (item.paymentMethod === "referral") setReferralFilter((prev) => [...prev, tempObj]);
        if (item.paymentMethod === "other") setOtherFilter((prev) => [...prev, tempObj]);
      });
    }
  }, [paymentData]);

  // Handle row click to navigate to the student page using degreeYear, degreeId, and studentId
  const handleViewFile = (value) => {    
    console.log(value);
    
    setFileViewModalOpen(true);
    setFilesToSend(value.files);
    setDataToSend(value);
  }

  const handleStatusButton = (value, note, type) => {
    handleStatusUpdate(value, note, type);
    setFileViewModalOpen(false)
  };

  const handleStatusUpdate = async(value, note, type) =>  {
    value.paymentVerificationStatus = type
    const paymentMethodMap = {
      cash: setCashFilter,
      bank: setBankFilter,
      referral: setReferralFilter,
      other: setOtherFilter,
    };
    
    const setter = paymentMethodMap[value.paymentMethod];
    if (setter) {
      setter((prev) =>
        prev.map((row) =>
          row.id === value.id
            ? {
                ...row,
                paymentVerificationStatus: type,
                approvalNoteLog: [
                  ...(Array.isArray(row.approvalNoteLog)
                    ? row.approvalNoteLog
                    : []),
                  {
                    approvalStatus: type,
                    approvalNote: note,
                    approvedBy: authUser.name,
                    date: new Date().toISOString(),
                  },
                ],
              }
            : row
        )
      );
    }

    try {
      const response = await updatePaymentStatus(
        value.id,
        value.paymentVerificationStatus,
        note,
        authUser.name
      );
      console.log("Response Data:", response);
    } catch (error) {
      console.log("Error submitting form: ", error.message);
    }
    

  };

  const handleDeletePayment = async (id, method) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    try {
      const response = await deletePayment(id);
      alert("Payment Details deleted:", response.message);

      const paymentMethodMap = {
        bank: setBankFilter,
        cash: setCashFilter,
        referral: setReferralFilter,
        other: setOtherFilter,
      };

      const setter = paymentMethodMap[method];
      if (setter) {
        setter((prev) => prev.filter((row) => row.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const columns = [
    { field: "financeID", headerName: "ID", flex: 0.25 },
    { field: "studentID", headerName: "sID", flex: 0.25 },
    { field: "studentName", headerName: "Student Name", flex: 0.5 },
    {
      field: "degreeYear",
      headerName: "Degree Year",
      flex: 0.5,
      valueGetter: (params) => formatDateString(params),
    },
    { field: "degreeName", headerName: "Degree Name", flex: 0.5 },
    { field: "moduleName", headerName: "Module Name", flex: 0.5 },
    // { field: "modulePrice", headerName: "Module Price", flex: 0.5 },
    { field: "paidAmount", headerName: "Paid Amount", flex: 0.5 },
    // { field: "paymentDue", headerName: "Payment Due", flex: 0.5 },
    {
      field: "paymentToDate",
      headerName: "Payment To Date",
      flex: 0.5,
      valueGetter: (params) => format(params, "dd/MM/yyyy"),
    },
    // {
    //   field: "paymentMethod",
    //   headerName: "Payment Method",
    //   flex: 0.5,
    //   valueGetter: (params) => enumToString("otherPaymentMethod", params),
    // },
    // { field: "paymentMethodDetails", headerName: "Details", flex: 0.5 },
    // { field: "userName", headerName: "Employee", flex: 0.5 },
    {
      field: "paymentVerificationStatus",
      headerName: "Verification Status",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          sx={{
            fontSize: { xs: 10, lg: 12 },
            minWidth: "auto", // Prevents it from being too wide
            maxWidth: "100%", // Ensures it doesn't exceed the column
            // whiteSpace: "nowrap", // Prevents text from wrapping
            overflow: "hidden", // Hides overflow if necessary
          }}
          variant={
            params.row.paymentVerificationStatus === "approved" ||
            params.row.paymentVerificationStatus === "rejected"
              ? "contained"
              : "outlined"
          }
          color={
            params.row.paymentVerificationStatus !== "approved"
              ? "error"
              : "success"
          }
          onClick={(event) => {
            event.stopPropagation(); // Prevents the row click event
            handleViewFile(params.row);
          }}
        >
          View
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.4,
      renderCell: (params) => (
        <Button
          color="error"
          variant="outlined"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleDeletePayment(params.row.id, params.row.paymentMethod);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const bankColumns = [
    { field: "financeID", headerName: "ID", flex: 0.25 },
    { field: "studentID", headerName: "sID", flex: 0.25 },
    { field: "studentName", headerName: "Student Name", flex: 0.5 },
    {
      field: "degreeYear",
      headerName: "Degree Year",
      flex: 0.5,
      valueGetter: (params) => formatDateString(params),
    },
    { field: "degreeName", headerName: "Degree Name", flex: 0.5 },
    { field: "moduleName", headerName: "Module Name", flex: 0.5 },
    // { field: "modulePrice", headerName: "Module Price", flex: 0.5 },
    { field: "paidAmount", headerName: "Paid Amount", flex: 0.5 },
    // { field: "paymentDue", headerName: "Payment Due", flex: 0.5 },
    {
      field: "paymentToDate",
      headerName: "Payment To Date",
      flex: 0.5,
      valueGetter: (params) => format(params, "dd/MM/yyyy"),
    },
    // {
    //   field: "paymentMethod",
    //   headerName: "Payment Method",
    //   flex: 0.5,
    //   valueGetter: (params) => enumToString("otherPaymentMethod", params),
    // },
    // { field: "paymentMethodDetails", headerName: "Details", flex: 0.5 },
    // { field: "bankPayeeName", headerName: "Payee Name", flex: 0.5 },
    // { field: "userName", headerName: "Employee", flex: 0.5 },
    {
      field: "paymentVerificationStatus",
      headerName: "Verification Status",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          sx={{
            fontSize: { xs: 10, lg: 12 },
            minWidth: "auto", // Prevents it from being too wide
            maxWidth: "100%", // Ensures it doesn't exceed the column
            // whiteSpace: "nowrap", // Prevents text from wrapping
            overflow: "hidden", // Hides overflow if necessary
          }}
          variant={
            params.row.paymentVerificationStatus === "approved" ||
            params.row.paymentVerificationStatus === "rejected"
              ? "contained"
              : "outlined"
          }
          color={
            params.row.paymentVerificationStatus !== "approved"
              ? "error"
              : "success"
          }
          onClick={(event) => {
            event.stopPropagation(); // Prevents the row click event
            handleViewFile(params.row);
          }}
        >
          View
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.4,
      renderCell: (params) => (
        <Button
          color="error"
          variant="outlined"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleDeletePayment(params.row.id, params.row.paymentMethod);
          }}
        >
          Delete
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
          columns={bankColumns}
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

      {fileViewModalOpen && (
        <FileView
          setOpen={setFileViewModalOpen}
          open={fileViewModalOpen}
          fileList={filesToSend}
          dataToSend={dataToSend}
          statusUpdate={handleStatusButton}
        />
      )}
    </Box>
  );
};

export default PaymentApproval;
