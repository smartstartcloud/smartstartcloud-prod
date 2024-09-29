import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchSingleDegreeData from '../../hooks/useFetchSingleDegreeData';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box, Card, CardContent, CircularProgress, Typography, useTheme, Grid, Divider, Button, Modal, TextField, Snackbar, IconButton,
} from '@mui/material';
import { tokens } from '../../theme';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';


const DegreeProfile = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate(); // useNavigate to handle navigation
    const { degreeYear, degreeId } = useParams();
    const { degree, loading, error } = useFetchSingleDegreeData(degreeId);
    const [errors, setErrors] = React.useState({});
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({
        studentID: '',
        studentName: '',
        studentLogin: '',
        studentPassword: '',
        studentContact: ''
    });

    const { degreeName, degreeAgent, degreeStudentList = [], degreeModules } = degree || {};

    const studentList = [...degreeStudentList];

    const validateForm = () => {
        const newErrors = {};
        if (!newStudent.studentID) newErrors.studentID = 'Student ID is required';
        if (!newStudent.studentName) newErrors.studentName = 'Student Name is required';
        if (!newStudent.studentLogin) newErrors.studentLogin = 'User Name is required';
        if (!newStudent.studentPassword) newErrors.studentPassword = 'Password is required';
        if (!newStudent.studentContact) newErrors.studentContact = 'Phone Number is required';
        return newErrors;
    };

    const columns = [
        { field: 'studentID', headerName: 'STUDENT ID', flex: 0.5 },
        { field: 'studentName', headerName: 'Name', flex: 1 },
        { field: 'studentLogin', headerName: 'User Name', flex: 1 },
        { field: 'studentPassword', headerName: 'Password', flex: 1 },
        { field: 'studentContact', headerName: 'Phone Number', flex: 1 },
    ];

    const handleAddStudent = () => {
        const updatedStudentList = [...studentList, newStudent];
        degreeStudentList.push(newStudent);

        setSnackbarOpen(true);
        setOpen(false);
        setNewStudent({
            studentID: '',
            studentName: '',
            studentLogin: '',
            studentPassword: '',
            studentContact: ''
        });
    };

    const handleSubmit = () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            handleAddStudent();
            setSnackbarOpen(true);
        } else {
            setErrors(validationErrors);
        }
    };

    // Handle row click to navigate to the student page using degreeYear, degreeId, and studentId
    const handleRowClick = (params) => {
        const studentId = params.row.studentID;
        // Assuming degreeYear is part of the degree data
        navigate(`/task/${degreeYear}/${degreeId}/${studentId}`, {
            state: {degreeModules}
        }); // Navigate to the student page
    };


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
        <Box m="20px" display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Card
                sx={{
                    width: '100%',
                    maxWidth: '1000px',
                    p: 3,
                    background: `linear-gradient(145deg, ${colors.blueAccent[700]}, ${colors.blueAccent[500]})`,
                    boxShadow: 6,
                    borderRadius: 4,
                    '&:hover': {
                        boxShadow: 12,
                    },
                }}
            >
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h3" color={colors.grey[100]} sx={{ fontWeight: 'bold', mb: 2 }}>
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
                                    <strong>Agent Enlisted:</strong> {`${degreeAgent?.firstName} ${degreeAgent?.lastName}`}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ p: 2, backgroundColor: colors.blueAccent[800], borderRadius: 2 }}>
                                <Typography variant="h4" color={colors.grey[100]} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    Degree Modules
                                </Typography>
                                <Divider sx={{ my: 1, borderColor: colors.grey[700] }} />
                                <Box>
                                    {degreeModules && degreeModules.length > 0 ? (
                                        degreeModules.map((module, index) => (
                                            <Typography
                                                key={index}
                                                variant="body1"
                                                color={colors.grey[200]}
                                                sx={{ textAlign: 'center', mb: 1 }}
                                            >
                                                {module.moduleName+": "+module.moduleCode}
                                            </Typography>
                                        ))
                                    ) : (
                                        <Typography variant="body1" color={colors.grey[400]} sx={{ textAlign: 'center' }}>
                                            No modules available.
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Box sx={{ width: '100%', maxWidth: '1000px', mt: 3 }}>
                <Typography
                    variant="h4"
                    sx={{
                        textAlign: 'center',
                        mb: 2,
                        color: colors.blueAccent[300],
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    }}
                >
                    Student List
                </Typography>
                <DataGrid
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: colors.blueAccent[200],
                            color: colors.black,
                            fontSize: '16px',
                        },
                        '& .MuiDataGrid-row': {
                            backgroundColor: colors.grey[50],
                            color: colors.black,
                            '&:hover': {
                                backgroundColor: colors.blueAccent[50],
                                transform: 'scale(1.01)',
                                transition: 'transform 0.2s',
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
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    autoHeight
                    onRowClick={handleRowClick} // Add onRowClick handler
                />
                <Button
                    variant="contained"
                    sx={{
                        mt: 3,
                        display: 'block',
                        mx: 'auto',
                        backgroundColor: colors.blueAccent[500],
                        '&:hover': {
                            backgroundColor: colors.blueAccent[600],
                        },
                    }}
                    onClick={() => setOpen(true)}
                >
                    Add Student
                </Button>
            </Box>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{
                        width: '400px',
                        backgroundColor: colors.grey[900],
                        padding: 3,
                        borderRadius: 3,
                        mx: 'auto',
                        mt: '10%',
                        position: 'relative',
                    }}
                >
                    <IconButton
                        onClick={() => setOpen(false)}
                        sx={{ position: 'absolute', top: 10, right: 10, color: colors.grey[50] }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h5" color={colors.grey[50]} sx={{ mb: 2 }}>
                        Add New Student
                    </Typography>
                    <TextField
                        label="Student ID"
                        fullWidth
                        error={!!errors.studentID}
                        helperText={errors.studentID}
                        value={newStudent.studentID}
                        onChange={(e) => {
                            setNewStudent({ ...newStudent, studentID: e.target.value });
                            setErrors({ ...errors, studentID: '' });
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Student Name"
                        fullWidth
                        error={!!errors.studentName}
                        helperText={errors.studentName}
                        value={newStudent.studentName}
                        onChange={(e) => {
                            setNewStudent({ ...newStudent, studentName: e.target.value });
                            setErrors({ ...errors, studentName: '' });
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Student Login"
                        fullWidth
                        error={!!errors.studentLogin}
                        helperText={errors.studentLogin}
                        value={newStudent.studentLogin}
                        onChange={(e) => {
                            setNewStudent({ ...newStudent, studentLogin: e.target.value });
                            setErrors({ ...errors, studentLogin: '' });
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Student Password"
                        fullWidth
                        error={!!errors.studentPassword}
                        helperText={errors.studentPassword}
                        value={newStudent.studentPassword}
                        onChange={(e) => {
                            setNewStudent({ ...newStudent, studentPassword: e.target.value });
                            setErrors({ ...errors, studentPassword: '' });
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Student Contact"
                        fullWidth
                        error={!!errors.studentContact}
                        helperText={errors.studentContact}
                        value={newStudent.studentContact}
                        onChange={(e) => {
                            setNewStudent({ ...newStudent, studentContact: e.target.value });
                            setErrors({ ...errors, studentContact: '' });
                        }}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            width: '100%',
                            backgroundColor: colors.blueAccent[500],
                            '&:hover': {
                                backgroundColor: colors.blueAccent[600],
                            },
                        }}
                    >
                        Add
                    </Button>
                </Box>
            </Modal>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message="New student added successfully!"
            />
        </Box>
    );
};

export default DegreeProfile;
