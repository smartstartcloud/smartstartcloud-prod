import { Box, Button, Grid, Paper, Typography, useTheme } from '@mui/material';
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import { tokens } from '../theme';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { format } from "date-fns";
import CustomDataToolbar from './CustomDataToolBar';

const PaymentDetailsDashboard = ({data, type}) => {
  const {dataYear, dataMonth, dataDetails} = data;  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (dataDetails && dataDetails.length > 0) {
      const formattedData = dataDetails.map((item) => ({
        id: item._id,
        financeID: item.financeID,
        degreeID: item.degreeID,
        degreeName: item.degreeName,
        studentID: item.studentID?.studentID,
        studentName: item.studentID?.studentName,
        moduleName: item.moduleName,
        modulePrice: item.modulePrice || 0,
        paidAmount: item.paidAmount || 0,
        paymentDue: item.totalPaymentDue || 0,
        paymentToDate: item.totalPaymentToDate,
        paymentVerificationStatus: item.paymentVerificationStatus,
        metadata: item.metadata,
      }));
      // Calculate totals
      const totalPaidAmount = formattedData.reduce(
        (sum, row) => sum + Number(row.paidAmount),
        0
      );
      const totalDueAmount = formattedData.reduce(
        (sum, row) => sum + Number(row.paymentDue),
        0
      );

      // const totalModulePrice = formattedData.reduce(
      //   (sum, row) => sum + Number(row.modulePrice),
      //   0
      // );

      // Append a footer row
      const totalRow = {
        financeID: `Total in`,
        degreeID: `${dataMonth} ${dataYear}`,
        // modulePrice: totalModulePrice,
        paidAmount: totalPaidAmount, // Total Paid Amount
        paymentDue: totalDueAmount, // Total Due Amount
      };
      setTableData([...formattedData, totalRow]);
    } else {
      setTableData([]);
    }
  }, [dataDetails]);

  const handleRowClick = (params) => {
    const { row } = params;
    console.log(row);
    
    if (row.metadata) {
      const { goTo, dataId } = row.metadata;
      navigate(goTo, { state: { dataId } });
    }
  };
 
  const columns = [
    { field: "financeID", headerName: "Payment ID", flex: 0.5 },
    { field: "degreeID", headerName: "Degree ID", flex: 0.5 },
    { field: "degreeName", headerName: "Degree Name", flex: 0.5 },
    { field: "paidAmount", headerName: "Approved Amount", flex: 0.5 },
    { field: "studentID", headerName: "sID", flex: 0.25 },
    { field: "studentName", headerName: "Student Name", flex: 0.5 },
    { field: "moduleName", headerName: "Module Name", flex: 0.5 },
    { field: "modulePrice", headerName: "Module Price", flex: 0.5 },
    { field: "paymentDue", headerName: "Payment Due", flex: 0.5 },
    {
      field: "paymentToDate",
      headerName: "Payment To Date",
      flex: 0.5,
      valueGetter: (params) => {
        if (!params) return ""; // Handle empty values gracefully
        return format(params, "dd/MM/yyyy"); // Ensure it's a valid date
      },
    },
    {
      field: "paymentVerificationStatus",
      headerName: "Verification Status",
      flex: 0.75,
      renderCell: (params) => {
        if (!params.row.paymentVerificationStatus) 
          return (
            <Typography></Typography>
          ); //
          else {
            return (
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
            );
          }
          
      },
    },
  ];
  
  return (
    <Paper elevation={3} sx={{ height: "100%", overflow: "auto" }}>
      <Box p={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} display="flex" justifyContent="center">
            <Box display="flex" justifyContent="center">
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Timeline
              </Typography>
              <Typography variant="h6" component="div" ml={2}>
                {dataMonth} {dataYear}
              </Typography>
            </Box>
          </Grid>

          {/* <Grid item xs={12} sm={3}>
            <Box display="flex" justifyContent="flex-start">
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {"Collected Amount"}
              </Typography>
              <Typography variant="subtitle1" component="div" ml={2}>
                {tableData.reduce((sum, item) => sum + item.approvedAmount, 0)}
              </Typography>
            </Box>
          </Grid> */}

          {/* <Grid item xs={12} sm={3}>
            <Box display="flex" justifyContent="flex-start">
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {"Total Due Amount"}
              </Typography>
              <Typography variant="subtitle1" component="div" ml={2}>
                {/* Total due amount calculation can be added here if needed */}
          {/* </Typography>
            </Box>
          </Grid> */}

          {/* <Grid item xs={12} sm={3}>
            <Box display="flex" justifyContent="flex-start">
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {"Percentage Collected"}
              </Typography>
              <Typography variant="subtitle1" component="div" ml={2}>
                {/* Percentage calculation can be added here if needed */}
          {/* </Typography>
            </Box>
          </Grid> */}
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
                    fontWeight: "bold",
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
                  "& .MuiDataGrid-cell": {
                    fontSize: "15px", // Increase cell font size
                  },
                  "& .MuiDataGrid-cell[data-field='approvedAmount']": {
                    fontWeight: "bold",
                  },
                  "& .MuiDataGrid-row:last-child": {
                    backgroundColor: colors.blueAccent[900], // Highlight last row
                    fontWeight: "bold",
                  },
                }}
                rows={tableData}
                columns={columns}
                getRowId={(row) => row.financeID}
                slots={{ toolbar: CustomDataToolbar }}
                slotProps={{
                  toolbar: { onRefresh: () => console.log("Refresh clicked!") }, // Pass function for refresh
                }}
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
                // onRowClick={handleRowClick}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default PaymentDetailsDashboard;