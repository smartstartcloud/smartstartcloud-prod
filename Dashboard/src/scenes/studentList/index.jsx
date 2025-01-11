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
import useFetchAllStudentData from "../../hooks/useFetchAllStudentData";

const StudentList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { student: studentList, loading, error } = useFetchAllStudentData();
  const [currentAvailableID, setCurrentAvailableID] = useState();
  const [availableIdList, setAvailableIdList] = useState([]);

  // useEffect(() => {
  //   if (studentList){
  //     console.log(studentList);
  //   }
  // }, [studentList])

  useEffect(() => {
    if (studentList) {
      setCurrentAvailableID(studentList.length + 1);
    }
  }, [studentList]);

  const columns = [
    { field: "studentID", headerName: "Student ID", flex: 0.5 },
    { field: "studentName", headerName: "Name", flex: 1 },
    { field: "studentLogin", headerName: "Username", flex: 1 },
    { field: "studentPassword", headerName: "Password", flex: 1 },
    { field: "studentContact", headerName: "Contact Number", flex: 1 },
    { field: "studentOfficePassword", headerName: "MS Office Password", flex: 1 },
    { field: "studentOther", headerName: "Other Information", flex: 1 },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   flex: 1,
    //   renderCell: (params) => (
    //     <div>
    //       <IconButton
    //         onClick={(event) => {
    //           event.stopPropagation(); // Prevents the row click event
    //           handleEdit(params.row);
    //         }}
    //       >
    //         <EditOutlinedIcon />
    //       </IconButton>
    //       <IconButton
    //         onClick={(event) => {
    //           event.stopPropagation(); // Prevents the row click event
    //           handleDelete(params.row);
    //         }}
    //       >
    //         <DeleteOutlineOutlinedIcon />
    //       </IconButton>
    //     </div>
    //   ),
    // },
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
      <Header title={`All Students`} subtitle="Here are all the students" />
      <Box sx={{ width: "90%", pt: 1, pb: 3, mx: "auto" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 1,
            color: colors.blueAccent[300],
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          Current Latest ID: s{currentAvailableID}
        </Typography>
        {studentList && <DataGrid
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
          rows={studentList}
          columns={columns}
          getRowId={(row) => row.studentID}
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
        />}
      </Box>
    </Box>
  );
};

export default StudentList;
