import { Box, Button, Grid, Paper, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { tokens } from '../theme';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const PaymentDetailsDashboard = ({data, type}) => {
  const {dataName, dataDetails} = data;
  console.log(data);
  
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    console.log(dataDetails);

    if (dataDetails && dataDetails.length > 0) {            
      setTableData([]);
      dataDetails.forEach((item) => {
        const tempObj = {
          id: item._id,
          studentID: item.studentID?.studentID,
          studentName: item.studentID?.studentName,
          moduleName: item.moduleName,
          modulePrice: item.modulePrice ? item.modulePrice : 0,
          paidAmount: item.paidAmount ? item.paidAmount : 0,
          paymentDue: item.totalPaymentDue ? item.totalPaymentDue : 0,
          paymentToDate: item.totalPaymentToDate,
          paymentVerificationStatus: item.paymentVerificationStatus,
        };
        setTableData((prev) => [...prev, tempObj]);
      });
    } else {
      setTableData([]);
    }
  }, [dataDetails]);
  
  // Check if data is defined and is an array
  const totalModulePriceTemp = Array.isArray(dataDetails)
    ? dataDetails.reduce((sum, item) => sum + Number(item.modulePrice || 0), 0)
    : 0;

  const totalPaidPriceTemp = Array.isArray(dataDetails)
    ? dataDetails.reduce((sum, item) => sum + Number(item.paidAmount || 0), 0)
    : 0;

  const totalApprovedPriceTemp = Array.isArray(dataDetails)
    ? dataDetails.reduce(
        (sum, item) =>
          item.paymentVerificationStatus === "approved"
            ? sum + Number(item.paidAmount || 0)
            : sum,
        0
      )
    : 0;

  const totalWaitingApprovalPriceTemp = Array.isArray(dataDetails)
    ? dataDetails.reduce(
        (sum, item) =>
          item.paymentVerificationStatus === "awaiting approval"
            ? sum + Number(item.paidAmount || 0)
            : sum,
        0
      )
    : 0;

    const totalPriceDueTemp = Array.isArray(dataDetails)
    ? dataDetails.reduce((sum, item) => sum + Number(item.totalPaymentDue || 0), 0)
    : 0;    

  const columns = [
    { field: "studentID", headerName: "sID", flex: 0.25 },
    { field: "studentName", headerName: "Student Name", flex: 0.5 },
    { field: "moduleName", headerName: "Module Name", flex: 0.5 },
    { field: "modulePrice", headerName: "Module Price", flex: 0.5 },
    { field: "paidAmount", headerName: "Paid Amount", flex: 0.5 },
    { field: "paymentDue", headerName: "Payment Due", flex: 0.5 },
    { field: "paymentToDate", headerName: "Payment To Date", flex: 0.5 },
    {
      field: "paymentVerificationStatus",
      headerName: "Verification Status",
      flex: 0.75,
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
        >
          {params.row.paymentVerificationStatus}
        </Button>
      ),
    },
  ];
  
  return (
    <Paper elevation={3} sx={{ height: "100%", overflow: "auto" }}>
      <Box p={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Box display="flex" justifyContent="flex-start">
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {type === "degree" ? "Degree Name" : "Year Name"}
              </Typography>
              <Typography variant="subtitle1" component="div" ml={2}>
                {dataName}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box display="flex" justifyContent="flex-start">
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {"Collected Amount"}
              </Typography>
              <Typography variant="subtitle1" component="div" ml={2}>
                {totalPaidPriceTemp}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box display="flex" justifyContent="flex-start">
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {"Total Due Amount"}
              </Typography>
              <Typography variant="subtitle1" component="div" ml={2}>
                {totalPriceDueTemp}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box display="flex" justifyContent="flex-start">
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {"Percentage Collected"}
              </Typography>
              <Typography variant="subtitle1" component="div" ml={2}>
                {((totalPaidPriceTemp/totalModulePriceTemp)*100).toFixed(2)} %
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ width: "100%", pt: 1, pb: 3, mx: "auto" }}>
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
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                      page: 0, // Initial page index
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 20]}
                autoHeight
                disableSelectionOnClick // Prevents row selection
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default PaymentDetailsDashboard;