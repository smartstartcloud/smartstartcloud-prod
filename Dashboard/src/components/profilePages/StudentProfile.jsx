import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useFetchSingleStudentData from '../../hooks/useFetchSingleStudentData';
import {Box,Button,Card,CardContent,CircularProgress,Grid,Typography,Dialog,useTheme,DialogTitle,DialogContent,IconButton, Divider, Chip,} from '@mui/material';
import { tokens } from '../../theme';
import AssignmentForm from '../forms/AssignmentForm';
import AssignmentList from './AssignmentList';
import useFetchAssignmentList from '../../hooks/useFetchAssignmentList';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from "@mui/icons-material/History";
import Slide from '@mui/material/Slide';
import { enumToString } from '../../utils/functions';
import useFetchPaymentWithDegree from '../../hooks/useFetchPaymentWithDegree';
import StudentHistory from '../StudentHistory';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const StudentProfile = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const location = useLocation();
    const { studentId, degreeId } = useParams();  
    
    const [historyModalOpen, setHistoryModalOpen] = useState(true)
    const { student, loading, error } = useFetchSingleStudentData(studentId);    
    const { fetchAssignmentList } = useFetchAssignmentList();
    const { fetchPaymentWithDegree } = useFetchPaymentWithDegree();

    const {
      _id,
      studentStatus,
      studentName,
      studentContact,
      studentLogin,
      studentPassword,
      studentOfficePassword,
      studentOther,
      groupName, tutorName, campusLocation,
      isExternal,
      universityName,
      courseName,
      year
    } = student || {};
    // console.log("student :::", student);
    
    const { degreeModules } = location.state || [];        

    const [open, setOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState(degreeModules[0]?._id || null);
    const [selectedModuleName, setSelectedModuleName] = useState(degreeModules[0]?.moduleName || "");
    const [assignmentList, setAssignmentList] = useState([]);
    const [moduleStudentID, setModuleStudentID] = useState('');
    const [moduleStudentPaymentPlan, setModuleStudentPaymentPlan] = useState('');
    const [listLoading, setListLoading] = useState(false);
    const [listError, setListError] = useState(false);
    const [listErrorMessage, setListErrorMessage] = useState('');
    const [allModuleAmountPaid, setAllModuleAmountPaid] = useState(0);
    const [totalAmountPaid, setTotalAmountPaid] = useState(0)
    const [totalAmountDue, setTotalAmountDue] = useState(0);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const formatPaymentPlan = (planArray) => {
      setTotalAmountPaid(0);
      setTotalAmountDue(0);
      const uniquePlans = [
        ...new Set(
          planArray.map((item) => enumToString("paymentPlan", item.paymentPlan))
        ),
      ];
      const planStr = uniquePlans.join(' / ')      
      setModuleStudentPaymentPlan(planStr);
      planArray.forEach((payment) => {
        if (payment.paymentVerificationStatus === "approved"){
          setTotalAmountPaid((prev) => prev + Number(payment.paidAmount ?? 0));
          setTotalAmountDue(
            (prev) => prev + Number(payment.totalPaymentDue ?? 0)
          );
        }
      });
    };

    const handleModuleClick = async (moduleId, moduleName) => {
        setSelectedModule(moduleId);
        setSelectedModuleName(moduleName);
        setListLoading(true);
        setListError(false);
        setAssignmentList([]);

        try {
            const response = await fetchAssignmentList(moduleId, _id);              
            setModuleStudentID(response.moduleStudentID);
            if (response.modulePaymentPlan) {              
              formatPaymentPlan(response.modulePaymentPlan);
            }
            if (Array.isArray(response.data)) {
                setAssignmentList([{ moduleName, moduleId }, ...response.data]);                
            } else {
                throw new Error("Invalid response from the server");
            }
        } catch (e) {
            setListError(true);
            setListErrorMessage(e.message);
        } finally {            
            setListLoading(false);
        }
    };

    const handlePaymentDataOnLoad = async (degreeID, studentID) => {
      try {
        const response = await fetchPaymentWithDegree(degreeID, studentID);
        if (response) {
          const totalModuleDatas = response
          setAllModuleAmountPaid(0);
          totalModuleDatas.forEach((payment) => {
            setAllModuleAmountPaid(
              (prev) => prev + Number(payment.paidAmount ?? 0)
            );
          });
        }
      } catch (e) {
        setListError(true);
        setListErrorMessage(e);
      }
    }

    useEffect(() => {              
        if (degreeModules.length > 0 && student) {
            handleModuleClick(degreeModules[0]._id, degreeModules[0].moduleName);
            handlePaymentDataOnLoad(degreeId, _id);
        }
    }, [degreeModules, student]);

    if (loading) {
        return (
            <Box mt="200px" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={150} sx={{ color: colors.blueAccent[100] }} />
            </Box>
        );
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    return (
      <Box
        m="20px auto"
        display="flex"
        flexDirection="column"
        maxWidth="1000px"
      >
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="h3"
                    color={colors.grey[100]}
                    sx={{ fontWeight: "bold", mb: 2 }}
                  >
                    Student Information
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  display="flex"
                  justifyContent="flex-end"
                  textAlign="right"
                  alignItems="center"
                  gap="10px"
                >
                  <IconButton
                    sx={{
                      color: theme.palette.grey[700],
                      backgroundColor: theme.palette.background.default,
                      borderRadius: "50%",
                      padding: "10px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        backgroundColor: theme.palette.background.default,

                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
                      },
                    }}
                    onClick={() => setHistoryModalOpen(true)}
                  >
                    <HistoryIcon />
                  </IconButton>
                  <Chip
                    variant="filled"
                    color={
                      studentStatus === "active"
                        ? "success"
                        : studentStatus === "inactive"
                        ? "error"
                        : studentStatus === "withdrawn"
                        ? "info"
                        : "default"
                    }
                    label={enumToString("studentStatus", studentStatus)}
                    sx={{
                      fontSize: "15px",
                      ...(studentStatus !== "active" &&
                        studentStatus !== "inactive" &&
                        studentStatus !== "withdrawn" && {
                          backgroundColor: "#FFF",
                          color: "#000",
                        }),
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold" }}
                      >
                        --- Cloud Student ID:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color={colors.grey[100]}>
                        {studentId}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold" }}
                      >
                        Name:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color={colors.grey[100]}>
                        {studentName}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold" }}
                      >
                        Contact:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color={colors.grey[100]}>
                        {studentContact}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}></Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold" }}
                      >
                        Login:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color={colors.grey[100]}>
                        {studentLogin}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold" }}
                      >
                        Password:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color={colors.grey[100]}>
                        {studentPassword}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold" }}
                      >
                        Office Password:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color={colors.grey[100]}>
                        {studentOfficePassword}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold" }}
                      >
                        Group Name:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color={colors.grey[100]}>
                        {groupName}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold" }}
                      >
                        Tutor Name:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color={colors.grey[100]}>
                        {tutorName}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold" }}
                      >
                        Campus Location:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color={colors.grey[100]}>
                        {campusLocation}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold" }}
                      >
                        Payment Plan:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color={colors.grey[100]}>
                        {moduleStudentPaymentPlan}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold" }}
                      >
                        Total Amount Paid in this Module:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color={colors.grey[100]}>
                        {totalAmountPaid}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold" }}
                      >
                        Total Amount Due in this Module:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color={colors.grey[100]}>
                        {totalAmountDue}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        variant="h6"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold" }}
                      >
                        Total Paid For The Year:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color={colors.grey[100]}>
                        {allModuleAmountPaid}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {isExternal && (
                <Box>
                  <Card
                    sx={{
                      width: "100%",
                      p: 1,
                      background: `linear-gradient(145deg, ${colors.blueAccent[700]}, ${colors.blueAccent[500]})`,
                      boxShadow: 6,
                      borderRadius: 4,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h4"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        External Student Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography
                            variant="h6"
                            color={colors.grey[100]}
                            sx={{ fontWeight: "bold" }}
                          >
                            University Name:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h6" color={colors.grey[100]}>
                            {universityName}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography
                            variant="h6"
                            color={colors.grey[100]}
                            sx={{ fontWeight: "bold" }}
                          >
                            Course Name:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h6" color={colors.grey[100]}>
                            {courseName}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography
                            variant="h6"
                            color={colors.grey[100]}
                            sx={{ fontWeight: "bold" }}
                          >
                            Year:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h6" color={colors.grey[100]}>
                            {year}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </CardContent>
          </Card>

          <Box sx={{ marginTop: 2, width: "100%" }}>
            <Typography
              variant="h4"
              color={colors.grey[100]}
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Module List
            </Typography>
            <Grid container spacing={2}>
              {degreeModules.map((module) => (
                <Grid item xs={12} md={4} key={module._id}>
                  <Card
                    onClick={() =>
                      handleModuleClick(module._id, module.moduleName)
                    }
                    sx={{
                      p: 3,
                      background:
                        selectedModule === module._id
                          ? `rgba(0, 0, 0, 0.1)`
                          : `linear-gradient(145deg, ${colors.blueAccent[700]}, ${colors.blueAccent[500]})`,
                      boxShadow: selectedModule === module._id ? 12 : 6,
                      cursor: "pointer",
                      borderRadius: 4,
                    }}
                  >
                    <Typography variant="h5" color={colors.grey[100]}>
                      {module.moduleName} - {module.moduleCode}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Box mt={2} sx={{ position: "relative" }}>
            <Button
              variant="contained"
              onClick={handleClickOpen}
              sx={{
                position: "absolute",
                right: 0,
                backgroundColor: colors.blueAccent[500],
                "&:hover": {
                  backgroundColor: colors.blueAccent[600],
                },
              }}
            >
              Add Assignment
            </Button>
          </Box>

          {listLoading ? (
            <Box
              mt={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress
                size={150}
                sx={{ color: colors.blueAccent[100] }}
              />
            </Box>
          ) : (
            <Box mt={2} mb={10}>
              <Typography
                variant="h3"
                color={colors.grey[100]}
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Assignments List for {selectedModuleName}
              </Typography>
              <AssignmentList
                list={assignmentList}
                degreeModules={degreeModules}
                student={student}
                moduleStudentID={moduleStudentID}
              />
              {assignmentList.length === 0 && (
                <Typography align="center" color={colors.grey[200]}>
                  No assignments found for this module.
                </Typography>
              )}
              {/* {listError && (
                            <Typography align="center" color="red">
                                {listErrorMessage}
                            </Typography>
                        )} */}
            </Box>
          )}
        </Box>
        <StudentHistory open={historyModalOpen} setOpen={setHistoryModalOpen} />

        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="md"
          PaperProps={{ style: { height: "50vh", overflow: "hidden" } }}
          TransitionComponent={Transition}
        >
          <DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ padding: 0 }}>
            <Box sx={{ height: "100%", width: "100%", overflowY: "auto" }}>
              <AssignmentForm
                studentData={student._id}
                degreeModulesData={degreeModules}
                editMode={false}
              />
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    );
};

export default StudentProfile;
