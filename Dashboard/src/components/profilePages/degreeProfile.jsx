import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useFetchSingleDegreeData from '../../hooks/useFetchSingleDegreeData';
import {
    Box, Card, CardContent, CircularProgress, Typography, useTheme, Grid, Divider, Button,
    IconButton
} from '@mui/material';
import { tokens } from '../../theme';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import StudentForm from '../forms/StudentForm.jsx';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import useDeleteObjects from '../../hooks/useDeleteObjects';
import DetailsBarChart from '../DetailsBarChart.jsx';
import { extractAssignmentPriority } from '../../utils/functions.js';
import { useAuthContext } from '../../context/AuthContext.jsx';



const DegreeProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isSuperAdmin } = useAuthContext();
  
  const { degreeYear, degreeId } = useParams();
  const { degree, loading, error } = useFetchSingleDegreeData(degreeId);
  const [open, setOpen] = useState(false);
  const [studentEditMode, setStudentEditMode] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [nextDeadlineData, setNextDeadlineData] = useState({});
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { deleteStudent, deleteDegree } = useDeleteObjects();
  const navigate = useNavigate(); 
  const location = useLocation();
  const dataId = location.state?.dataId || null    

  const {degreeName,degreeAgent,degreeStudentList = [],degreeModules} = degree || {};
  
  useEffect(() => {
    if (degree){      
      const nextDeadline = extractAssignmentPriority(degreeModules);            
      setNextDeadlineData(nextDeadline);      
    }
  }, [degree])

  const studentList = [...degreeStudentList];

  const columns = [
    { field: "studentID", headerName: "--- Cloud Student ID", flex: 0.5 },
    { field: "studentName", headerName: "Name", flex: 1 },
    { field: "studentLogin", headerName: "Username", flex: 1 },
    { field: "studentPassword", headerName: "Password", flex: 1 },
    { field: "studentContact", headerName: "Contact Number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={(event) => {
              event.stopPropagation(); // Prevents the row click event
              handleEdit(params.row);
            }}
          >
            <EditOutlinedIcon />
          </IconButton>
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
  const handleModuleClick = (module) => {
    // Assuming degreeYear is part of the degree data    
    const moduleId = module._id 
    navigate(`/task/${degreeYear}/${degreeId}/module/${module.moduleCode}`, {
      state: {moduleId}
    });

  };

  // Handle row click to navigate to the student page using degreeYear, degreeId, and studentId
  const handleRowClick = (params) => {
    const studentId = params.row.studentID;
    // Assuming degreeYear is part of the degree data
    navigate(`/task/${degreeYear}/${degreeId}/student/${studentId}`, {
      state: { degreeModules },
    }); // Navigate to the student page
  };

  const handleEdit = (data) => {
    setStudentData(data);
    setStudentEditMode(true);
    setOpen(true);
  };

  const handleAdd = () => {
    setStudentData({});
    setStudentEditMode(false);
    setOpen(true);
  };

  const handleDelete = async (data) => {
    
    if (!window.confirm("Are you sure you want to delete this Student?"))
      return;
    try{
      const response = await deleteStudent(data._id,degree.degreeID)
      console.log("Response Data:", response);
      navigate(0);
    }catch (e) {
        console.log("Error submitting form: ", e.message)
    }
  };

  const handleDegreeDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this Degree?"))
      return;
    try {
      const response = await deleteDegree(degree.degreeID);
      console.log("Degree deleted:", response);
      navigate("/allDegrees");
    } catch (e) {
      console.log("Error deleting degree: ", e.message);
    }
  };
  const handleDegreeEdit = async (degree, editMode) => {
    navigate(`/task/${degreeYear}/${degreeId}/editDegree`, { state: {editMode: editMode, degree: degree} });
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
    <Box
      m="20px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: "1000px",
          p: 3,
          background: `linear-gradient(145deg, ${colors.blueAccent[700]}, ${colors.blueAccent[500]})`,
          boxShadow: 6,
          borderRadius: 4,
          "&:hover": {
            boxShadow: 12,
          },
          position: "relative",
          overflow: "visible",
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h3"
                color={colors.grey[100]}
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Degree Information
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h5" color={colors.grey[200]}>
                  <strong>Degree ID:</strong> {degreeId}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h5" color={colors.grey[200]}>
                  <strong>Degree Name:</strong> {degreeName}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h5" color={colors.grey[200]}>
                  <strong>Agent Enlisted:</strong>{" "}
                  {`${degreeAgent?.firstName} ${degreeAgent?.lastName}`}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h5" color={colors.grey[200]}>
                  <strong>Active Module:</strong> {nextDeadlineData?.moduleName}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h5" color={colors.grey[200]}>
                  <strong>Active Assignment:</strong>{" "}
                  {nextDeadlineData?.assignmentName}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="h5"
                  color={
                    nextDeadlineData?.color === "red"
                      ? colors.redAccent[500]
                      : colors.grey[200]
                  }
                  sx={{
                    textShadow:
                      nextDeadlineData?.color === "red"
                        ? "1px 1px 5px white"
                        : "none",
                  }}
                >
                  <strong>Next Deadline:</strong>{" "}
                  {nextDeadlineData?.color === "red" ? (
                    <strong>{nextDeadlineData?.deadline}</strong>
                  ) : (
                    nextDeadlineData?.deadline
                  )}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: colors.blueAccent[800],
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h4"
                  color={colors.grey[100]}
                  sx={{ textAlign: "center", fontWeight: "bold" }}
                >
                  Degree Modules
                </Typography>
                <Divider sx={{ my: 1, borderColor: colors.grey[700] }} />
                <Box>
                  {degreeModules && degreeModules.length > 0 ? (
                    degreeModules.map((module) => (
                      <Typography
                        key={module.moduleCode}
                        variant="body1"
                        color={colors.grey[200]}
                        sx={{
                          textAlign: "center",
                          mb: 1,
                          cursor: "pointer",
                          transition: "transform 0.3s ease", // smooth transition
                          "&:hover": {
                            transform: "scale(1.3)", // scale to 1.5 on hover
                          },
                        }}
                        onClick={() => handleModuleClick(module)}
                      >
                        {module.moduleName}
                      </Typography>
                    ))
                  ) : (
                    <Typography
                      variant="body1"
                      color={colors.grey[400]}
                      sx={{ textAlign: "center" }}
                    >
                      No modules available.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              position: "absolute",
              top: 40,
              right: 0,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              transform: "translateX(50%)",
            }}
          >
            {isSuperAdmin && (
              <IconButton
                onClick={handleDegreeDelete}
                sx={{
                  // position: "absolute",
                  // top: 119,
                  // right: 123,
                  borderRadius: "100%",
                  border: "white 3px solid",
                  backgroundColor: colors.redAccent[500],
                  color: colors.grey[100],
                  "&:hover": {
                    backgroundColor: colors.redAccent[600],
                    transform: "scale(1.1)",
                    transition: "transform 0.2s",
                  },
                  boxShadow: 3,
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            )}
            <IconButton
              onClick={() => handleDegreeEdit(degree, true)}
              sx={{
                // position: "absolute",
                // top: 0,
                // right: 0,
                borderRadius: "100%",
                border: "white 3px solid",
                backgroundColor: colors.greenAccent[500],
                color: colors.grey[100],
                "&:hover": {
                  backgroundColor: colors.greenAccent[600],
                  transform: "scale(1.1)",
                  transition: "transform 0.2s",
                },
                boxShadow: 3,
              }}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ width: "100%", maxWidth: "1000px" }}>
        <Typography
          variant="h4"
          textAlign="center"
          mb={2}
          color={colors.blueAccent[300]}
        >
          Student List
        </Typography>
        <DataGrid
          rows={studentList}
          columns={columns}
          getRowId={(row) => row._id}
          slots={{ toolbar: GridToolbar }}
          // initialState={{
          //   pagination: { paginationModel: { pageSize: 1 } },
          // }}
          pageSizeOptions={[5, 10, 20, 100]}
          autoHeight
          onRowClick={handleRowClick}
          sx={{
            cursor: "pointer",
            "& .Mui-selected": {
              background:
                "linear-gradient(90deg,rgba(255, 0, 0, .3) 0%, rgba(255, 255, 255, 1) 100%); !important", // light red
            },
            "& .Mui-selected:hover": {
              background:
                "linear-gradient(90deg,rgba(255, 0, 0, .5) 0%, rgba(255, 255, 255, 1) 100%); !important",
            },
          }}
          rowSelectionModel={dataId ? [dataId] : []} // Pre-selects the passed row ID
        />
        <Button
          variant="contained"
          sx={{
            mt: 3,
            display: "block",
            mx: "auto",
            backgroundColor: colors.blueAccent[500],
          }}
          onClick={() => handleAdd()}
        >
          Add Student
        </Button>
      </Box>

      {degree.moduleDetailsList && (
        <Box sx={{ width: "100%", maxWidth: "1000px", marginBottom: "20px" }}>
          <Typography
            variant="h4"
            textAlign="center"
            mb={2}
            color={colors.blueAccent[300]}
          >
            Analytics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DetailsBarChart
                data={degree.moduleDetailsList}
                headLine="Status Chart"
                type="status"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailsBarChart
                data={degree.moduleDetailsList}
                headLine="Grade Chart"
                type="grade"
              />
            </Grid>
          </Grid>
        </Box>
      )}

      <StudentForm
        open={open}
        setOpen={setOpen}
        degreeID={degreeId}
        studentData={studentData}
        studentEditMode={studentEditMode}
      />

      {/* <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message="New student added successfully!"
            /> */}
    </Box>
  );
};

export default DegreeProfile;
