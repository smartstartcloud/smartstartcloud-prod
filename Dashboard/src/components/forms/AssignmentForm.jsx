import React, { useEffect, useState } from 'react'
import {Alert, Box, Button,CircularProgress, Grid, MenuItem, Select, Snackbar, TextField, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';

import { Controller, useForm } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format } from 'date-fns';
import useSendAssignmentData from '../../hooks/useSendAssignmentData';
import MuiAlert from '@mui/material/Alert';

const AssignmentForm = ({studentData, degreeModulesData}) => {
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
            assignmentDeadline: ''
        }
    });

    // Use useEffect to update form values once student data is fetched
    useEffect(() => {
        if (studentData && studentData._id) {
            reset({
                studentID: studentData._id, // Dynamically set the studentID after data is fetched
                moduleID: '',
                orderID: '',
                assignmentName: '',
                assignmentType: '',
                assignmentProgress: '',
                assignmentPayment: 0,
                assignmentDeadline: ''
            });
        }
    }, [studentData, studentData._id, reset]);

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
            sx={{p: 3, width: '95%', maxWidth: '100%', margin: '0 auto', mt: 5 ,
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
            <Typography variant="h4" gutterBottom>Assignment Form</Typography>

            <form onSubmit={handleSubmit(onSubmitAssignment)}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Controller
                            name='moduleID'
                            control={control}
                            render={({field})=>(
                                <Select
                                    {...field}
                                    variant="outlined"
                                    fullWidth
                                    displayEmpty
                                    required
                                    sx={{ mb: 2 }}
                                >
                                    <MenuItem value="" disabled>Select Module</MenuItem>
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
                            name='studentID'
                            control={control}
                            render={({field})=>(
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
                                    helperText={touchedFields.studentID && errors.studentID ? errors.studentID.message : null}
                                    onBlur={(e) => {
                                        field.onBlur();
                                        if (!field.value) {
                                            setError("studentID", { type: "manual", message: "Student ID is required" });
                                        }else {
                                            clearErrors("studentID");
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Controller
                            name='orderID'
                            control={control}
                            render={({field})=>(
                                <TextField
                                    {...field}
                                    label="Order ID"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                    error={!!touchedFields.orderID && !!errors.orderID}
                                    helperText={touchedFields.orderID && errors.orderID ? errors.orderID.message : null}
                                    onBlur={(e) => {
                                        field.onBlur();
                                        if (!field.value) {
                                            setError("orderID", { type: "manual", message: "Order ID is required" });
                                        }else {
                                            clearErrors("orderID");
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
                            name='assignmentName'
                            control={control}
                            render={({field})=>(
                                <TextField
                                    {...field}
                                    label="Assignment Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                    error={!!touchedFields.assignmentName && !!errors.assignmentName}
                                    helperText={touchedFields.assignmentName && errors.assignmentName ? errors.assignmentName.message : null}
                                    onBlur={(e) => {
                                        field.onBlur();
                                        if (!field.value) {
                                            setError("assignmentName", { type: "manual", message: "Assignment Name is required" });
                                        }else {
                                            clearErrors("assignmentName");
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
                            name='assignmentType'
                            control={control}
                            render={({field})=>(
                                <TextField
                                    {...field}
                                    label="Assignment Type"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                    error={!!touchedFields.assignmentType && !!errors.assignmentType}
                                    helperText={touchedFields.assignmentType && errors.assignmentType ? errors.assignmentType.message : null}
                                    onBlur={(e) => {
                                        field.onBlur();
                                        if (!field.value) {
                                            setError("assignmentType", { type: "manual", message: "Assignment Type is required" });
                                        }else {
                                            clearErrors("assignmentType");
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Controller
                            name='assignmentProgress'
                            control={control}
                            render={({field})=>(
                                <TextField
                                    {...field}
                                    label="Assignment Progress"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    type="number" // Set the input type to number
                                    sx={{ mb: 2 }}
                                    error={!!touchedFields.assignmentProgress && !!errors.assignmentProgress}
                                    helperText={touchedFields.assignmentProgress && errors.assignmentProgress ? errors.assignmentProgress.message : null}
                                    onBlur={(e) => {
                                        field.onBlur();
                                        if (!field.value) {
                                            setError("assignmentProgress", { type: "manual", message: "Assignment Progress is required" });
                                        }else {
                                            clearErrors("assignmentProgress");
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Controller
                            name='assignmentPayment'
                            control={control}
                            render={({field})=>(
                                <Select
                                    {...field}
                                    variant="outlined"
                                    fullWidth
                                    displayEmpty
                                    required
                                    sx={{ mb: 2 }}
                                >
                                    <MenuItem value={0}>NOT PAID</MenuItem>
                                    <MenuItem value={1}>PAID</MenuItem>
                                </Select>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Controller
                                name='assignmentDeadline'
                                control={control}
                                render={({field})=>(
                                    <DatePicker
                                        {...field}
                                        label="Assignment Deadline"
                                        inputFormat="MM/dd/yyyy" // You can customize the date and time format
                                        value={field.value ? new Date(field.value) : null} // Ensure the value is a Date object
                                        onChange={(newValue) => {field.onChange(newValue ? format(newValue, 'MM/dd/yyyy') : '')}}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    sx={{
                        width: '200px',
                        backgroundColor: colors.grey[200],
                        color: colors.grey[900],
                        '&:hover': { backgroundColor: colors.grey[100] },
                        mt: 2, // Adds margin-top to create spacing from the form elements
                        ml: 'auto', // Automatically adds left margin to push the button to the right
                        display: 'block' // Ensures the button behaves like a block element
                    }}
                    type="submit"
                    disabled={formLoading}
                >
                    {formLoading ? (
                        <CircularProgress size={24} sx={{ color: colors.grey[900] }} />
                    ) : (
                        'Submit'
                    )}
                </Button>

            </form>

            <Snackbar open={formSaved} autoHideDuration={3000} onClose={handleAssignmentClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleAssignmentClose} severity="success">
                    Assignment Form submitted successfully!
                </MuiAlert>
            </Snackbar>
            <Snackbar open={formError} autoHideDuration={6000} onClose={handleAssignmentCloseError}>
                <Alert onClose={handleAssignmentCloseError} severity="error" sx={{ width: '100%' }}>
                    Assignment Form submission failed. {formErrorMessage}. Please try again.
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default AssignmentForm