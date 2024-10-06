import React, { useEffect, useState } from 'react'
import {Alert, Box, Button,CircularProgress, Grid, MenuItem, Select, Snackbar, TextField, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';

import { Controller, useForm } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format } from 'date-fns';
import useSendAssignmentData from '../../hooks/useSendAssignmentData';
import MuiAlert from '@mui/material/Alert';

const AssignmentForm = ({studentData, degreeModulesData, editMode}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formSaved, setFormSaved] = useState(false);
    const [formError, setFormError] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState('');
    const [formLoading, setformLoading] = useState(false);

    const { sendAssignment } = useSendAssignmentData()

    const { control, handleSubmit, setError, clearErrors, reset, formState: { errors, touchedFields } } = useForm({
        defaultValues: {
            studentID: studentData._id,
            moduleID: '',
            orderID: '',
            assignmentName: '',
            assignmentType: '',
            assignmentProgress: '',
            assignmentPayment: 0,
            assignmentDeadline: '',
            assignmentGrade: ''
        }
    });

    useEffect(() => {
        if (studentData && studentData._id) {
            if (editMode) {
                reset({
                    studentID: studentData?._id,
                    moduleID: studentData?.moduleID || '',
                    orderID: studentData?.orderID || '',
                    assignmentName: studentData?.assignmentName || '',
                    assignmentType: studentData?.assignmentType || '',
                    assignmentProgress: studentData?.assignmentProgress || '',
                    assignmentPayment: studentData?.assignmentPayment || 0,
                    assignmentDeadline: studentData?.assignmentDeadline || '',
                    assignmentGrade: studentData?.assignmentGrade || ''
                });
            } else {
                reset({
                studentID: studentData._id, 
                moduleID: '',
                orderID: '',
                assignmentName: '',
                assignmentType: '',
                assignmentProgress: '',
                assignmentPayment: 0,
                assignmentDeadline: '',
                assignmentGrade: '',
            });
            }
        }
    }, [studentData, studentData._id, reset, editMode]);

    const onSubmitAssignment = async (data) => {
        setformLoading(true);
        try{
            const response = await sendAssignment(data)
            console.log('Form Data:', data);
            console.log('Response Data:', response);
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
            width: '95%',
            maxWidth: '100%',
            margin: '0 auto',
            mt: 5,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: colors.grey[300],
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.grey[100],
              },
            },
            '& .MuiInputLabel-root': {
              color: colors.grey[300],
            },
            '& .MuiInputLabel-root.Mui-focused': {
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
                  name="moduleID"
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
                        <MenuItem key={index} value={module._id}>
                          {module.moduleName}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="studentID"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={studentData._id}
                      disabled
                      label="Student ID"
                      variant="outlined"
                      fullWidth
                      required
                      sx={{ mb: 2 }}
                      error={!!touchedFields.studentID && !!errors.studentID}
                      helperText={
                        touchedFields.studentID && errors.studentID
                          ? errors.studentID.message
                          : null
                      }
                      onBlur={(e) => {
                        field.onBlur();
                        if (!field.value) {
                          setError('studentID', {
                            type: 'manual',
                            message: 'Student ID is required',
                          });
                        } else {
                          clearErrors('studentID');
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="orderID"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Order ID"
                      variant="outlined"
                      fullWidth
                      required
                      sx={{ mb: 2 }}
                      error={!!touchedFields.orderID && !!errors.orderID}
                      helperText={
                        touchedFields.orderID && errors.orderID
                          ? errors.orderID.message
                          : null
                      }
                      onBlur={(e) => {
                        field.onBlur();
                        if (!field.value) {
                          setError('orderID', {
                            type: 'manual',
                            message: 'Order ID is required',
                          });
                        } else {
                          clearErrors('orderID');
                        }
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
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
                      error={!!touchedFields.assignmentName && !!errors.assignmentName}
                      helperText={
                        touchedFields.assignmentName && errors.assignmentName
                          ? errors.assignmentName.message
                          : null
                      }
                      onBlur={(e) => {
                        field.onBlur();
                        if (!field.value) {
                          setError('assignmentName', {
                            type: 'manual',
                            message: 'Assignment Name is required',
                          });
                        } else {
                          clearErrors('assignmentName');
                        }
                      }}
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
                      error={!!touchedFields.assignmentType && !!errors.assignmentType}
                      helperText={
                        touchedFields.assignmentType && errors.assignmentType
                          ? errors.assignmentType.message
                          : null
                      }
                      onBlur={(e) => {
                        field.onBlur();
                        if (!field.value) {
                          setError('assignmentType', {
                            type: 'manual',
                            message: 'Assignment Type is required',
                          });
                        } else {
                          clearErrors('assignmentType');
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
                    <TextField
                      {...field}
                      label="Assignment Progress"
                      variant="outlined"
                      fullWidth
                      required
                      type="number"
                      sx={{ mb: 2 }}
                      error={!!touchedFields.assignmentProgress && !!errors.assignmentProgress}
                      helperText={
                        touchedFields.assignmentProgress && errors.assignmentProgress
                          ? errors.assignmentProgress.message
                          : null
                      }
                      onBlur={(e) => {
                        field.onBlur();
                        if (!field.value) {
                          setError('assignmentProgress', {
                            type: 'manual',
                            message: 'Assignment Progress is required',
                          });
                        } else {
                          clearErrors('assignmentProgress');
                        }
                      }}
                      InputProps={{
                        readOnly: !editMode,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Controller
                  name="assignmentPayment"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Assignment Payment"
                      variant="outlined"
                      fullWidth
                      required
                      type="number"
                      sx={{ mb: 2 }}
                      error={!!touchedFields.assignmentPayment && !!errors.assignmentPayment}
                      helperText={
                        touchedFields.assignmentPayment && errors.assignmentPayment
                          ? errors.assignmentPayment.message
                          : null
                      }
                      onBlur={(e) => {
                        field.onBlur();
                        if (!field.value) {
                          setError('assignmentPayment', {
                            type: 'manual',
                            message: 'Assignment Payment is required',
                          });
                        } else {
                          clearErrors('assignmentPayment');
                        }
                      }}
                      InputProps={{
                        readOnly: !editMode,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="assignmentDeadline"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Assignment Deadline"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            fullWidth
                            required
                            error={!!touchedFields.assignmentDeadline && !!errors.assignmentDeadline}
                            helperText={
                              touchedFields.assignmentDeadline && errors.assignmentDeadline
                                ? errors.assignmentDeadline.message
                                : null
                            }
                          />
                        )}
                        onChange={(newValue) => {
                          field.onChange(format(newValue, 'yyyy-MM-dd'));
                        }}
                        onBlur={() => {
                          if (!field.value) {
                            setError('assignmentDeadline', {
                              type: 'manual',
                              message: 'Assignment Deadline is required',
                            });
                          } else {
                            clearErrors('assignmentDeadline');
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="grades"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Grades"
                      variant="outlined"
                      fullWidth
                      required
                      sx={{ mb: 2 }}
                      error={!!touchedFields.grades && !!errors.grades}
                      helperText={
                        touchedFields.grades && errors.grades
                          ? errors.grades.message
                          : null
                      }
                      onBlur={(e) => {
                        field.onBlur();
                        if (!field.value) {
                          setError('grades', {
                            type: 'manual',
                            message: 'Grades is required',
                          });
                        } else {
                          clearErrors('grades');
                        }
                      }}
                      InputProps={{
                        readOnly: true, // Set to true to prevent editing when not in edit mode
                      }}
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
              {formLoading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </form>
    
          <Snackbar
            open={formSaved}
            autoHideDuration={6000}
            onClose={handleAssignmentClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MuiAlert onClose={handleAssignmentClose} severity="success">
              Assignment submitted successfully!
            </MuiAlert>
          </Snackbar>
    
          <Snackbar
            open={formError}
            autoHideDuration={6000}
            onClose={handleAssignmentCloseError}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MuiAlert onClose={handleAssignmentCloseError} severity="error">
              {formErrorMessage}
            </MuiAlert>
          </Snackbar>
        </Box>
      );
}

export default AssignmentForm