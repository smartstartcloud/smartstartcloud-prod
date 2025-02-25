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
import useFetchAllAgentData from "../../hooks/useFetchAllAgentData";
import useDeleteObjects from "../../hooks/useDeleteObjects";

  
  const AgentList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { deleteUser } = useDeleteObjects();
    const { agentList, loading, error } = useFetchAllAgentData();
    const [finalAgentList, setFinalAgentList] = useState()
    useEffect(() => {
      if (agentList){
        console.log(agentList);
        setFinalAgentList(agentList);
      }
    }, [agentList])
  
    const columns = [
      { field: "userID", headerName: "User ID", flex: 1 },
      { field: "firstName", headerName: "First Name", flex: 1 },
      { field: "lastName", headerName: "Last Name", flex: 1 },
      { field: "email", headerName: "Email", flex: 1 },
      { field: "userName", headerName: "User Name", flex: 1 },
      { field: "gender", headerName: "Gender", flex: 1 },
      { field: "role", headerName: "Role", flex: 1 },
      {
        field: "modify",
        headerName: "Modify",
        flex: .5,
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
  
    const handleEdit = (data) => {
      console.log(data);
    };
  
    const handleDelete = async (data) => {
      console.log(data);
      try {
        const response = await deleteUser(data._id);
        setFinalAgentList((prev) => prev.filter((item) => item._id !== data._id));
        console.log("User deleted:", response);
      } catch (e) {
        console.log("Error deleting Logs: ", e.message);
      }
    };
  
    if (loading) {
      return (
        <Box
          mt="200px"
          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
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
        <Header title={`All Agents`} subtitle="Here are all the Agents" />
        <Box sx={{ width: "90%", pt: 1, pb: 3, mx: "auto" }}>
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
            rows={finalAgentList}
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
  
  export default AgentList;
  