import {
  Box,
  Typography,
  useTheme,
  IconButton,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import useFetchAllActionLogs from "../../hooks/useFetchAllActionLogs";
import { formatDate } from "../../utils/functions";

const LogList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { logList, loading, error } = useFetchAllActionLogs();

    useEffect(() => {
        if (logList) {
        console.log(logList);
        }
    }, [logList]);

    const columns = [
      { field: "_id", headerName: "ID", flex: 0.5 },
      { field: "userName", headerName: "Made By", flex: 1 },
      { field: "message", headerName: "Log Message", flex: 5 },
      { field: "collectionName", headerName: "Collection Affected", flex: 1 },
      { field: "action", headerName: "Affected By", flex: .75 },
      {
        field: "timestamp",
        headerName: "Last Modified",
        flex: 2,
        renderCell: (params) => formatDate(params.value),
      },
      {
        field: "modify",
        headerName: "Modify",
        flex: 1,
        renderCell: (params) => (
          <div>
            <IconButton
              onClick={(event) => {
                event.stopPropagation(); // Prevents the row click event
                handleDelete(params.row);
              }}
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </div>
        ),
      },
    ];
    // Handle row click to navigate to the student page using degreeYear, degreeId, and studentId
    const handleRowClick = (params) => {
      console.log(params.row);
    };

    const handleDelete = async (data) => {
      console.log(data);
    };

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
        <Header title={`All User Logs`} subtitle="Here are all the user logs." />
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
            rows={logList}
            columns={columns}
            getRowId={(row) => row._id}
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
            onRowClick={handleRowClick} // Add onRowClick handler
          />
        </Box>
      </Box>
    );
};

export default LogList;
