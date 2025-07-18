import React, { useEffect, useState } from 'react'
import {Alert, Box, Button,CircularProgress, Grid, MenuItem, Select, Snackbar, TextField, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';

import { Controller, useForm } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format } from 'date-fns';
import useSendAssignmentData from '../../hooks/useSendAssignmentData';
import MuiAlert from '@mui/material/Alert';
import OrderSelect from '../OrderSelect';

const AssignmentForm = ({student_id, degreeModulesData, assignmentData, editMode}) => {
  
 const theme = useTheme();
 const colors = tokens(theme.palette.mode);
 const [formSaved, setFormSaved] = useState(false);
 const [formError, setFormError] = useState(false);
 const [formErrorMessage, setFormErrorMessage] = useState('');
 const [formLoading, setformLoading] = useState(false);
 
 const navigate = useNavigate(); 
 
 const { sendAssignment } = useSendAssignmentData() 

 const {
   control,
   handleSubmit,
   setError,
   clearErrors,
   reset,
   formState: { errors, touchedFields },
 } = useForm({
   defaultValues: {
     studentID: student_id,
     moduleCode: "",
     orderID: "",
     assignmentName: "",
     assignmentType: "",
     assignmentProgress: "TBA",
     assignmentDeadline: "",
     assignmentGrade: "",
     wordCount: "",
     referenceNumber: "",
   },
 });

    useEffect(() => {    
        if (student_id) {
            if (editMode) {
                reset({
                  assignmentID: assignmentData?._id || "", // Adding assignmentID when editMode is true
                  studentID: student_id,
                  moduleCode: assignmentData?.moduleCode || "",
                  orderID: assignmentData?.orderID || "",
                  assignmentName: assignmentData?.assignmentName || "",
                  assignmentType: assignmentData?.assignmentType || "",
                  assignmentProgress: assignmentData?.assignmentProgress || "TBA",
                  assignmentDeadline: assignmentData?.assignmentDeadline || "",
                  assignmentGrade: assignmentData?.assignmentGrade || "",
                  wordCount: assignmentData?.wordCount || "",
                  referenceNumber: assignmentData?.referenceNumber || "",
                });
            } else {              
                reset({
                  studentID: student_id,
                  moduleCode: "",
                  orderID: "",
                  assignmentName: "",
                  assignmentType: "",
                  assignmentProgress: "TBA",
                  assignmentDeadline: "",
                  assignmentGrade: "",
                  wordCount: "",
                  referenceNumber: "",
                });
            }
        }
    }, [student_id, reset, editMode]);

    const onSubmitAssignment = async (data) => {
        setformLoading(true);
        try{
          const response = await sendAssignment(data, editMode)
          console.log("Form Data:", data);
          console.log("Response Data:", response);
          setFormSaved(true);
          setformLoading(false);

        }catch (e) {
            setFormError(true);
            setformLoading(false)
            setFormErrorMessage(e.message)
            console.log("Error submitting form: ", e.message)
        }
    }

    const handleAssignmentClose = () => {
        setFormSaved(false);
    };

    const handleAssignmentCloseError = () => {
        setFormError(false);
    };

    return (
      <Box
        mt={3}
        sx={{
          p: 3,
          width: "95%",
          maxWidth: "100%",
          margin: "0 auto",
          mt: 5,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: colors.grey[300],
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.grey[100],
            },
          },
          "& .MuiInputLabel-root": {
            color: colors.grey[300],
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: colors.grey[100],
          },
        }}
      >
        <Typography variant="h4" gutterBottom>
          Assignment Form
        </Typography>

        <form onSubmit={handleSubmit(onSubmitAssignment)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Controller
                name="moduleCode"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    variant="outlined"
                    fullWidth
                    displayEmpty
                    required
                    sx={{ mb: 2 }}
                    disabled={editMode}
                  >
                    <MenuItem value="" disabled>
                      Select Module
                    </MenuItem>
                    {degreeModulesData.map((module, index) => (
                      <MenuItem key={index} value={module.moduleCode}>
                        {module.moduleCode}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </Grid>
            {/* <Grid item xs={12} sm={4}>
              <Controller
                name="studentID"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={student_id}
                    disabled
                    label="Student ID"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </Grid> */}
            <Grid item xs={12} sm={4}>
              <OrderSelect control={control} editMode={editMode} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Controller
                name="assignmentName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Assignment Name"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    error={
                      !!touchedFields.assignmentName && !!errors.assignmentName
                    }
                    helperText={
                      touchedFields.assignmentName && errors.assignmentName
                        ? errors.assignmentName.message
                        : null
                    }
                    onBlur={(e) => {
                      field.onBlur();
                      if (!field.value) {
                        setError("assignmentName", {
                          type: "manual",
                          message: "Assignment Name is required",
                        });
                      } else {
                        clearErrors("assignmentName");
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="wordCount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Word Count"
                    variant="outlined"
                    type="number"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Controller
                name="assignmentType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Assignment Type"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    error={
                      !!touchedFields.assignmentType && !!errors.assignmentType
                    }
                    helperText={
                      touchedFields.assignmentType && errors.assignmentType
                        ? errors.assignmentType.message
                        : null
                    }
                    onBlur={(e) => {
                      field.onBlur();
                      if (!field.value) {
                        setError("assignmentType", {
                          type: "manual",
                          message: "Assignment Name is required",
                        });
                      } else {
                        clearErrors("assignmentType");
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller
                name="assignmentProgress"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    // label="Assignment Progress"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="TBA">TO BE ASSIGNED</MenuItem>
                    <MenuItem value="ORDER ID ASSIGNED">
                      ORDER ID ASSIGNED
                    </MenuItem>
                    <MenuItem value="FILE READY TO UPLOAD">FILE READY TO UPLOAD</MenuItem>
                    <MenuItem value="FILE UPLOADED">FILE UPLOADED</MenuItem>
                    <MenuItem value="WAITING TO BE GRADED">WAITING TO BE GRADED</MenuItem>
                    <MenuItem value="PASSED">PASSED</MenuItem>
                    <MenuItem value="FAILED">
                      FAILED
                    </MenuItem>
                  </Select>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="assignmentDeadline"
                  control={control}
                  rules={{
                    required: "Assignment Deadline is required", // Validation rule to require the field
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="Assignment Deadline"
                      format="dd/MM/yyyy" // Custom date format
                      value={field.value ? new Date(field.value) : null} // Ensure the value is a Date object
                      onChange={(newValue) => {
                        field.onChange(newValue || "");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          required
                          error={!!error} // Display error if validation fails
                          helperText={error ? error.message : null} // Show the error message
                        />
                      )}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={5.25} sm={3}>
              <Controller
                name="assignmentGrade"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Assignment Grade"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    type="number"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={formLoading}
          >
            {formLoading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </form>

        <Snackbar
          open={formSaved}
          autoHideDuration={6000}
          onClose={handleAssignmentClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert onClose={handleAssignmentClose} severity="success">
            Assignment submitted successfully!
          </MuiAlert>
        </Snackbar>

        <Snackbar
          open={formError}
          autoHideDuration={6000}
          onClose={handleAssignmentCloseError}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert onClose={handleAssignmentCloseError} severity="error">
            {formErrorMessage}
          </MuiAlert>
        </Snackbar>
      </Box>
    );
}

export default AssignmentForm