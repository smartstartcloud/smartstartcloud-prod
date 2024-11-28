import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { tokens } from '../../theme'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Dialog,
  useTheme,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import FileUpload from '../FileUpload';
import useFetchModuleData from '../../hooks/useFetchModuleData';
import ModuleAssignmentTable from '../ModuleAssignmentTable';
import { extractObjects } from '../../utils/functions';


const ModuleProfile = () => {
  const { degreeId, moduleCode } = useParams();
  const [orderIdToPass, setOrderIdToPass] = useState(moduleCode);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const { moduleId } = location.state || [];
  // console.log(degreeId, moduleCode, moduleId);
  const { moduleData, loading, error } = useFetchModuleData(degreeId, moduleId);
  const [mainAssignmentList, setMainAssignmentList] = useState([]);
  const [singleAssignmentList, setSingleAssignmentList] = useState(null);
  const handleFileOpen = () => {
    setOpen(true);
  };
  const handleAssignmentButton = (value) => {
    for (let assignment of mainAssignmentList){      
      if (assignment.referenceNumber === value) {
        return assignment
      }
    }
  };

  useEffect(() => {    
    if (moduleData) {
      setMainAssignmentList(extractObjects(moduleData.moduleAssignments));
    }
  }, [moduleData]);

  useEffect(() => {
    if (mainAssignmentList.length > 0) {
      // Set the first item in single assignment list
      setSingleAssignmentList(mainAssignmentList[0]);
    }
  }, [mainAssignmentList]); // This will trigger when mainAssignmentList is updated

  // useEffect(() => {
  //   // Log the single assignment list whenever it changes
  //   console.log(singleAssignmentList);
  // }, [singleAssignmentList]); // Log every time singleAssignmentList changes

  return (
    <Box m="20px auto" display="flex" flexDirection="column" maxWidth="1000px">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        mb={2}
      >
        <Card
          sx={{
            width: "100%",
            p: 2,
            background: `linear-gradient(145deg, ${colors.greenAccent[700]}, ${colors.greenAccent[500]})`,
            boxShadow: 6,
            borderRadius: 4,
          }}
        >
          <CardContent>
            <Typography
              variant="h3"
              color={colors.grey[100]}
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Module Information
            </Typography>

            <Grid container spacing={2} mt={2}>
              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  color={colors.grey[100]}
                  sx={{ fontWeight: "bold" }}
                >
                  Module Code:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color={colors.grey[100]}>
                  {moduleCode}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} display="flex" justifyContent="center">
                <Typography
                  variant="h5"
                  color={colors.grey[100]}
                  sx={{ fontWeight: "bold" }}
                >
                  Assignment List:
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              mt={0}
              display="flex"
              justifyContent="center"
            >
              {mainAssignmentList.map((assignment, idx) => (
                <Grid item xs={2} key={idx}>
                  <Button
                    onClick={() =>
                      setSingleAssignmentList(
                        handleAssignmentButton(assignment.referenceNumber)
                      )
                    }
                    sx={{
                      fontSize: "10px",

                      padding: "15px 20px",
                      backgroundColor: colors.greenAccent[200], // Set background color
                      color: colors.grey[900], // Set text color
                      "&:hover": {
                        backgroundColor: colors.greenAccent[300], // Set hover color
                      },
                    }}
                  >
                    {assignment.assignmentName}
                  </Button>
                </Grid>
              ))}
            </Grid>
            {singleAssignmentList && (
              <Grid container spacing={2} mt={2}>
                <Grid item xs={6} display="flex" justifyContent="space-between">
                  <Typography variant="h5" color={colors.grey[100]}>
                    Name:
                  </Typography>
                  <Typography variant="h5" color={colors.grey[100]}>
                    {singleAssignmentList.assignmentName}
                  </Typography>
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="space-between">
                  <Typography variant="h5" color={colors.grey[100]}>
                    Type:
                  </Typography>
                  <Typography variant="h5" color={colors.grey[100]}>
                    {singleAssignmentList.assignmentType}
                  </Typography>
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="space-between">
                  <Typography variant="h5" color={colors.grey[100]}>
                    Deadline:
                  </Typography>
                  <Typography variant="h5" color={colors.grey[100]}>
                    {singleAssignmentList.assignmentDeadline}
                  </Typography>
                </Grid>
                <Grid item xs={6} display="flex" justifyContent="space-between">
                  <Typography variant="h5" color={colors.grey[100]}>
                    Reference:
                  </Typography>
                  <Typography variant="h5" color={colors.grey[100]}>
                    {singleAssignmentList.referenceNumber}
                  </Typography>
                </Grid>
              </Grid>
            )}
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} container alignItems="center" spacing={1}>
                <Grid item>
                  <Button
                    onClick={handleFileOpen}
                    startIcon={<FolderOpenOutlinedIcon />}
                    sx={{
                      backgroundColor: colors.grey[100], // Set background color
                      color: colors.grey[900], // Set text color
                      "&:hover": {
                        backgroundColor: colors.grey[200], // Set hover color
                      },
                    }}
                    variant="contained" // or "outlined" based on your styling preference
                  >
                    Open Module Brief
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {moduleData && moduleData.moduleData && (
          <Box m="20px 0px">
            <ModuleAssignmentTable studentData={moduleData.moduleData} />
          </Box>
        )}
        {open && (
          <FileUpload
            setOpen={setOpen}
            open={open}
            orderID={orderIdToPass}
            isModule={true}
          />
        )}
      </Box>
    </Box>
  );
}

export default ModuleProfile