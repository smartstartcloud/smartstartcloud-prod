import React, { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import useFetchSingleStudentData from '../../hooks/useFetchSingleStudentData';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, CircularProgress, Divider, Grid, IconButton, Modal, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const StudentProfile = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { studentId } = useParams();
    const location = useLocation(); // Access the passed state
    const {student, loading, error} = useFetchSingleStudentData(studentId);
    const { _id, studentName, studentContact, studentLogin, studentPassword, studentAssignment = [] } = student || {};
    const { degreeModules } = location.state || {};

    const [open, setOpen] = useState(false);
    console.log(degreeModules);
    
    const taken = ['Module 1', 'Module 3']

    const handleModuleCLick = (item, isValid) => {
        console.log(item, isValid, _id);
    }

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
        <Box m="20px auto" display="flex" flexDirection="column" alignItems="center" gap={2} maxWidth='1000px'>
            <Card
                sx={{
                    width: '100%',
                    maxWidth: '1000px',
                    p: 3,
                    background: `linear-gradient(145deg, ${colors.greenAccent[700]}, ${colors.greenAccent[500]})`,
                    boxShadow: 6,
                    borderRadius: 4,
                    '&:hover': {
                        boxShadow: 12,
                    },
                }}
            >
                <CardContent>
                    <Grid container spacing={2} alignItems='center'>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h3" color={colors.grey[100]} sx={{ fontWeight: 'bold', mb: 2 }}>
                                Student Information
                            </Typography>
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="h5" color={colors.grey[200]}>
                                    <strong>Student ID:</strong> {studentId}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="h5" color={colors.grey[200]}>
                                    <strong>Student Name:</strong> {studentName}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="h5" color={colors.grey[200]}>
                                    <strong>Student Contact:</strong> {studentContact}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="h5" color={colors.grey[200]}>
                                    <strong>Student Login:</strong> {studentLogin}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="h5" color={colors.grey[200]}>
                                    <strong>Student Password:</strong> {studentPassword}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ p: 2, backgroundColor: colors.greenAccent[800], borderRadius: 2 }}>
                                <Typography variant="h4" color={colors.grey[100]} sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    Student Modules Taken
                                </Typography>
                                <Divider sx={{ my: 1, borderColor: colors.grey[700] }} />
                                <Box>
                                    {degreeModules && degreeModules.length > 0 ? (
                                        degreeModules.map((module, index) => (
                                            <Typography
                                                key={index}
                                                variant="body1"
                                                color={colors.grey[200]}
                                                sx={{ textAlign: 'center', mb: 1,  textDecoration: taken.includes(module.moduleName) ? 'none' : 'line-through' }}
                                            >
                                                {module.moduleName}
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
            
            <Box mt={3}>
                <Typography variant="h3" color={colors.grey[100]} sx={{ fontWeight: 'bold', mb: 2 }}>
                    Module List
                </Typography>
                <Grid container spacing={2} alignItems='center' width='1000px'>
                    {degreeModules.map((module)=> (
                        <Grid key={module._id} item xs={12} sm={3}>
                            <Card
                                sx={{
                                    width: '100%',
                                    p: 5,
                                    background: `linear-gradient(145deg, ${taken.includes(module.moduleName) ? colors.blueAccent[700] : colors.redAccent[700]}, ${taken.includes(module.moduleName) ? colors.blueAccent[500] : colors.redAccent[500]})`,
                                    boxShadow: 6,
                                    cursor: 'pointer',
                                    borderRadius: 4,
                                    '&:hover': {
                                        boxShadow: 12,
                                    },
                                }}
                                onClick={()=>handleModuleCLick(module._id, taken.includes(module.moduleName))}
                            >
                                <Typography variant="h3" color={colors.grey[100]} sx={{ fontWeight: 'bold', textAlign: 'center'}}>
                                    {module.moduleName}
                                </Typography>
                            </Card>
                        </Grid>

                    ))}
                    
                </Grid>
                {/* <Button
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
                </Button> */}
            </Box>
            {/* <Modal open={open} onClose={() => setOpen(false)}>
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
            </Modal> */}
            <Box mt={3} width='100%'>
                <Typography variant="h3" color={colors.grey[100]} sx={{ fontWeight: 'bold', mb: 2}}>
                    Assignment List for Module 1
                </Typography>
                <Grid container spacing={2} width='100%' mt={2}>
                    <Accordion sx={{width: '100%', background: colors.grey[900], color: colors.grey[200]}}>
                        <AccordionSummary
                        expandIcon={<ArrowDropDownIcon sx={{color: colors.grey[200]}} />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                        >
                            <Grid item xs={6} sm={3} >
                                <Typography>
                                    Academic Skills for Business Management 
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3} >
                                <Typography>
                                    Group Presentation 
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={3} >
                                <Typography>
                                    27/02/23
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={2} >
                                <Typography>
                                    55%
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={1} >
                                <Typography>
                                    PAID
                                </Typography>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails sx={{background: colors.grey[800], color: colors.grey[200]}}>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Box>
        </Box>
        

    )
}

export default StudentProfile