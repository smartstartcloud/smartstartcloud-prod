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

const PaymentApproval = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { paymentData, error, loading } = useAllGetPaymentDetails();
  const { updatePaymentStatus } = useSendPaymentData();
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (paymentData && paymentData.length > 0) {
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
          paymentDue: item.paymentDue ? item.paymentDue : 0,
          paymentToDate: item.paymentToDate,
          paymentMethod: item.paymentMethod,
          userName: item.user?.userName,
          paymentVerificationStatus: item.paymentVerificationStatus,
        };
        setTableData((prev) => [...prev, tempObj]);
      });
    }
  }, [paymentData]);

  // Handle row click to navigate to the student page using degreeYear, degreeId, and studentId
  const handleStatusUpdate = (value) => {
    updatePaymentStatus(value.id, value.paymentVerificationStatus === "awaiting approval"?"approved":"awaiting approval");
    setTableData((prev)=> 
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
      <Box sx={{ width: "90%", pt: 1, pb: 3, mx: "auto" }}>
        {/* <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 1,
            color: colors.blueAccent[300],
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          Current Latest ID: s{currentAvailableID}
        </Typography> */}
        <DataGrid
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[200],
              color: colors.black,
              fontSize: "16px",
            },
            "& .MuiDataGrid-row": {
              backgroundColor: colors.grey[50],
              color: colors.black,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: colors.blueAccent[50],
                transform: "scale(1.01)",
                transition: "transform 0.2s",
              },
            },
          }}
          rows={tableData}
          columns={columns}
          getRowId={(row) => row.id}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0, // Initial page index
              },
            },
          }}
          pageSizeOptions={[10, 20, 50, 100]}
          autoHeight
          disableSelectionOnClick // Prevents row selection
        />
      </Box>
    </Box>
  );
};

export default PaymentApproval;
