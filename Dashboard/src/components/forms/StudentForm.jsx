import React, { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box, CircularProgress, Typography, useTheme, Button, Modal, TextField, Snackbar, IconButton,
    Alert,
    Checkbox,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { tokens } from '../../theme';
import MuiAlert from '@mui/material/Alert';
import useSendStudentData from '../../hooks/useSendStudentData';

const StudentForm = ({open, setOpen, degreeID, studentData, studentEditMode=false}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { sendStudent, updateStudent } = useSendStudentData();
    const [formSaved, setFormSaved] = useState(false);
    const [formError, setFormError] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState('');
    const [formLoading, setformLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [newStudent, setNewStudent] = useState({
      studentStatus: studentData.studentStatus || "",
      studentID: studentData.studentID || "",
      studentName: studentData.studentName || "",
      studentLogin: studentData.studentLogin || "",
      studentPassword: studentData.studentPassword || "",
      studentContact: studentData.studentContact || "",
      studentOther: studentData.studentOther || "",
      studentOfficePassword: studentData.studentOfficePassword || "",
      degreeID: degreeID,
      groupName: studentData.groupName || "",
      tutorName: studentData.tutorName || "",
      campusLocation: studentData.campusLocation || "",
      universityName: studentData.universityName || "",
      courseName: studentData.courseName || "",
      year: studentData.year || "",
      isExternal: studentData.isExternal || false,
    });
    
    const [isExternalStudent, setIsExternalStudent] = useState(false);

    useEffect(() => {
      if (studentEditMode) {
        setNewStudent({
          _id: studentData._id,
          studentStatus: studentData.studentStatus || "",
          studentID: studentData.studentID || "",
          studentName: studentData.studentName || "",
          studentLogin: studentData.studentLogin || "",
          studentPassword: studentData.studentPassword || "",
          studentContact: studentData.studentContact || "",
          studentOther: studentData.studentOther || "",
          studentOfficePassword: studentData.studentOfficePassword || "",
          degreeID: degreeID,
          groupName: studentData.groupName || "",
          tutorName: studentData.tutorName || "",
          campusLocation: studentData.campusLocation || "",
          universityName: studentData.universityName || "",
          courseName: studentData.courseName || "",
          year: studentData.year || "",
          isExternal: studentData.isExternal || false,
        });
        setIsExternalStudent(!!studentData.universityName); // If university name exists, set external student to true
      } else {
        setNewStudent({
          studentStatus: "",
          studentID: "",
          studentName: "",
          studentLogin: "",
          studentPassword: "",
          studentContact: "",
          degreeID: degreeID,
          studentOther: "",
          studentOfficePassword: "",
          groupName: "",
          tutorName: "",
          campusLocation: "",
          universityName: "",
          courseName: "",
          year: "",
          isExternal: false,
        });
        setIsExternalStudent(false);
      }
    }, [studentEditMode, studentData, degreeID]);
    

    const validateForm = () => {
        const newErrors = {};
        if (!newStudent.studentID) newErrors.studentID = 'Student ID is required';
        if (!newStudent.studentName) newErrors.studentName = 'Student Name is required';
        return newErrors;
    };

    const handleSubmit = () => {        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            if(studentEditMode) {
                handleUpdateStudent();
            } else {
              handleAddStudent();
            }
            // navigate(0);
        } else {
            setErrors(validationErrors);
        }
    };

    const handleSnackbarClose = () => {
        setFormSaved(false);
    };

    const handleSnackbarCloseError = () => {
        setFormError(false);
    };

    const handleAddStudent = async () => {        
        setformLoading(true);
        try{
            const response = await sendStudent(newStudent)            
            console.log('Form Data:', newStudent);
            console.log('Response Data:', response);
            setFormSaved(true);
            setformLoading(false);
        }catch (e) {
            setFormError(true);
            setformLoading(false)
            setFormErrorMessage(e.message)
            console.log("Error submitting form: ", e.message)
            setOpen(false)
        }
        setNewStudent({
          studentStatus: "",
          studentID: "",
          studentName: "",
          studentLogin: "",
          studentPassword: "",
          studentContact: "",
          degreeID: degreeID,
          studentOther: "",
          studentOfficePassword: "",
          groupName: "",
          tutorName: "",
          campusLocation: "",
          universityName: "",
          courseName: "",
          year: "",
          isExternal: false,
        });
    };

    const handleUpdateStudent = async () => {
      setformLoading(true);
      try {        
        const response = await updateStudent(newStudent);
        console.log("Form Data:", newStudent);
        console.log("Response Data:", response);
        setFormSaved(true);
        setformLoading(false);
      } catch (e) {
        setFormError(true);
        setformLoading(false);
        setFormErrorMessage(e.message);
        console.log("Error submitting form: ", e.message);
        setOpen(false);
      }
      setNewStudent({
        studentStatus: studentData.studentStatus || "",
        studentID: studentData.studentID || "",
        studentName: studentData.studentName || "",
        studentLogin: studentData.studentLogin || "",
        studentPassword: studentData.studentPassword || "",
        studentContact: studentData.studentContact || "",
        studentOther: studentData.studentOther || "",
        studentOfficePassword: studentData.studentOfficePassword || "",
        degreeID: degreeID,
        groupName: studentData.groupName || "",
        tutorName: studentData.tutorName || "",
        campusLocation: studentData.campusLocation || "",
        universityName: studentData.universityName || "",
        courseName: studentData.courseName || "",
        year: studentData.year || "",
        isExternal: studentData.isExternal || false,
      });
    };

    return (
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: "600px",
            backgroundColor: "#f7f5f5",
            padding: 3,
            borderRadius: 3,
            mx: "auto",
            mt: "10%",
            position: "relative",
            maxHeight: "90vh",
            overflowY: "auto",
            top: "-80px",
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: colors.grey[50],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" color={colors.grey[50]} sx={{ mb: 2 }}>
            Add New Student
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth error={!!errors.studentStatus}>
                <InputLabel id="student-status-label">
                  Student Status
                </InputLabel>
                <Select
                  labelId="student-status-label"
                  value={newStudent.studentStatus}
                  label="Student Status"
                  onChange={(e) => {
                    setNewStudent({
                      ...newStudent,
                      studentStatus: e.target.value,
                    });
                    setErrors({ ...errors, studentStatus: "" });
                  }}
                >
                  <MenuItem value="noStatus">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="active">ACTIVE</MenuItem>
                  <MenuItem value="inactive">INACTIVE</MenuItem>
                  <MenuItem value="withdrawn">WITHDRAWN</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Student ID"
                fullWidth
                error={!!errors.studentID}
                helperText={errors.studentID}
                value={newStudent.studentID}
                onChange={(e) => {
                  setNewStudent({ ...newStudent, studentID: e.target.value });
                  setErrors({ ...errors, studentID: "" });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Student Name"
                fullWidth
                error={!!errors.studentName}
                helperText={errors.studentName}
                value={newStudent.studentName}
                onChange={(e) => {
                  setNewStudent({ ...newStudent, studentName: e.target.value });
                  setErrors({ ...errors, studentName: "" });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Student Login"
                fullWidth
                error={!!errors.studentLogin}
                helperText={errors.studentLogin}
                value={newStudent.studentLogin}
                onChange={(e) => {
                  setNewStudent({
                    ...newStudent,
                    studentLogin: e.target.value,
                  });
                  setErrors({ ...errors, studentLogin: "" });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Student Password"
                fullWidth
                error={!!errors.studentPassword}
                helperText={errors.studentPassword}
                value={newStudent.studentPassword}
                onChange={(e) => {
                  setNewStudent({
                    ...newStudent,
                    studentPassword: e.target.value,
                  });
                  setErrors({ ...errors, studentPassword: "" });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Student Contact"
                fullWidth
                error={!!errors.studentContact}
                helperText={errors.studentContact}
                value={newStudent.studentContact}
                onChange={(e) => {
                  setNewStudent({
                    ...newStudent,
                    studentContact: e.target.value,
                  });
                  setErrors({ ...errors, studentContact: "" });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Other Information"
                fullWidth
                error={!!errors.studentOther}
                helperText={errors.studentOther}
                value={newStudent.studentOther}
                onChange={(e) => {
                  setNewStudent({
                    ...newStudent,
                    studentOther: e.target.value,
                  });
                  setErrors({ ...errors, studentOther: "" });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Student Office Password"
                fullWidth
                error={!!errors.studentOfficePassword}
                helperText={errors.studentOfficePassword}
                value={newStudent.studentOfficePassword}
                onChange={(e) => {
                  setNewStudent({
                    ...newStudent,
                    studentOfficePassword: e.target.value,
                  });
                  setErrors({ ...errors, studentOfficePassword: "" });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Group Name"
                fullWidth
                value={newStudent.groupName}
                onChange={(e) => {
                  setNewStudent({ ...newStudent, groupName: e.target.value });
                  setErrors({ ...errors, groupName: "" });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tutor Name"
                fullWidth
                value={newStudent.tutorName}
                onChange={(e) => {
                  setNewStudent({ ...newStudent, tutorName: e.target.value });
                  setErrors({ ...errors, tutorName: "" });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Campus Location"
                fullWidth
                value={newStudent.campusLocation}
                onChange={(e) => {
                  setNewStudent({
                    ...newStudent,
                    campusLocation: e.target.value,
                  });
                  setErrors({ ...errors, campusLocation: "" });
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Checkbox
              checked={newStudent.isExternal}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsExternalStudent(checked);
                setNewStudent({
                  ...newStudent,
                  isExternal: checked,
                  ...(!checked && {
                    universityName: "",
                    courseName: "",
                    year: "",
                  }),
                });
              }}
            />
            <Typography variant="body1">External Student</Typography>
          </Box>
          {isExternalStudent && (
            <>
              <TextField
                label="University Name"
                fullWidth
                value={newStudent.universityName}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    universityName: e.target.value,
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                label="Course Name"
                fullWidth
                value={newStudent.courseName}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, courseName: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                label="Year"
                fullWidth
                value={newStudent.year}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, year: e.target.value })
                }
                sx={{ mb: 2 }}
              />
            </>
          )}

          {studentEditMode ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={formLoading}
              sx={{
                width: "100%",
                backgroundColor: colors.blueAccent[500],
                "&:hover": {
                  backgroundColor: colors.blueAccent[600],
                },
              }}
            >
              {formLoading ? (
                <CircularProgress size={24} sx={{ color: colors.grey[900] }} />
              ) : (
                "Update Student"
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={formLoading}
              sx={{
                width: "100%",
                backgroundColor: colors.blueAccent[500],
                "&:hover": {
                  backgroundColor: colors.blueAccent[600],
                },
              }}
            >
              {formLoading ? (
                <CircularProgress size={24} sx={{ color: colors.grey[900] }} />
              ) : (
                "Add Student"
              )}
            </Button>
          )}

          <Snackbar
            open={formSaved}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={handleSnackbarClose}
              severity="success"
            >
              Student added successfully!
            </MuiAlert>
          </Snackbar>
          <Snackbar
            open={formError}
            autoHideDuration={6000}
            onClose={handleSnackbarCloseError}
          >
            <Alert
              onClose={handleSnackbarCloseError}
              severity="error"
              sx={{ width: "100%" }}
            >
              Failed adding student. {formErrorMessage}. Please try again.
            </Alert>
          </Snackbar>
        </Box>
      </Modal>
    );
}

export default StudentForm