import React, { useState } from 'react'
import {
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from '../theme';
import CustomToolbar from './CustomDataGridToolbar';
import { isAfter, isBefore, isSameDay } from "date-fns";

const PaymentApprovalTable = ({columns, dataId, list, listName}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [dateFilter, setDateFilter] = useState({ from: null, to: null });

  const handleDateFilterChange = (key, value) => {
    setDateFilter((prev) => ({ ...prev, [key]: value }));
  };

  const filteredRows = list.filter((singleList) => {
    const paymentDate = new Date(singleList.paymentToDate); // Ensure this is the actual column key

    const from = dateFilter.from;
    const to = dateFilter.to;

    if (from && isBefore(paymentDate, from) && !isSameDay(paymentDate, from))
      return false;
    if (to && isAfter(paymentDate, to) && !isSameDay(paymentDate, to))
      return false;

    return true;
  });

  return (
    <Box sx={{ width: "97%", pt: 1, pb: 3 }}>
      <Box mb={2}>
        <Typography variant="h3">{listName}</Typography>
      </Box>
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
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.id}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: {
            fromDate: dateFilter.from,
            toDate: dateFilter.to,
            onDateFilterChange: handleDateFilterChange,
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
              page: 0, // Initial page index
            },
          },
        }}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        autoHeight
        disableSelectionOnClick // Prevents row selection
        rowSelectionModel={dataId ? [dataId] : []} // Pre-selects the passed row ID
      />
    </Box>
  );
}

export default PaymentApprovalTable