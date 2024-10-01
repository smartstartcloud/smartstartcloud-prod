import React, {useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import useFetchSingleStudentData from '../../hooks/useFetchSingleStudentData';
import {Box, Button, Card, CardContent, CircularProgress, Divider, IconButton, Grid, Typography, Dialog, useTheme, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { tokens } from '../../theme';
import AssignmentForm from '../forms/AssignmentForm';
import AssignmentList from './AssignmentList';
import useFetchAssignmentList from '../../hooks/useFetchAssignmentList';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';


// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StudentProfile = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const location = useLocation(); // Access the passed state
    const { studentId } = useParams();


    
    const {student, loading, error} = useFetchSingleStudentData(studentId);
    const {fetchAssignmentList} = useFetchAssignmentList()
    
    const { _id, studentName, studentContact, studentLogin, studentPassword } = student || {};
    const { degreeModules } = location.state || {};

    const [open, setOpen] = useState(false);

    // Functions to handle opening and closing the dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const [assignmentList, setassignmentList] = useState(null);
    const [listError, setListError] = useState(false);
    const [listErrorMessage, setListErrorMessage] = useState('');
    const [listLoading, setListLoading] = useState(false);

    const handleModuleCLick = async (moduleId, moduleName) => {
        setListLoading(true);
        try {
            const response = await fetchAssignmentList(moduleId, _id)
            response.push({"moduleName":moduleName})
            setassignmentList(response)
            setListError(false);
            setListLoading(false);
        } catch (e) {
            setListError(true);
            setListLoading(false)
            setListErrorMessage(e.message)
        }
        
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
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h3" color={colors.grey[100]} sx={{ fontWeight: 'bold', mb: 2,textAlign: 'center' }}>
                                Student Information
                            </Typography>
                            <Box sx={{ mb: 1,textAlign: 'center'}}>
                                <Typography variant="h5" color={colors.grey[200]}>
                                    <strong>Student ID:</strong> {studentId}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 1,textAlign: 'center' }}>
                                <Typography variant="h5" color={colors.grey[200]}>
                                    <strong>Student Name:</strong> {studentName}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 1,textAlign: 'center' }}>
                                <Typography variant="h5" color={colors.grey[200]}>
                                    <strong>Student Contact:</strong> {studentContact}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 1,textAlign: 'center' }}>
                                <Typography variant="h5" color={colors.grey[200]}>
                                    <strong>Student Login:</strong> {studentLogin}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 1,textAlign: 'center' }}>
                                <Typography variant="h5" color={colors.grey[200]}>
                                    <strong>Student Password:</strong> {studentPassword}
                                </Typography>
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
                                    background: `linear-gradient(145deg, ${colors.blueAccent[700]}, ${colors.blueAccent[500]})`,
                                    boxShadow: 6,
                                    cursor: 'pointer',
                                    borderRadius: 4,
                                    '&:hover': {
                                        boxShadow: 12,
                                    },
                                }}
                                onClick={()=>handleModuleCLick(module._id, module.moduleName)}
                            >
                                <Typography variant="h3" color={colors.grey[100]} sx={{ fontWeight: 'bold', textAlign: 'center'}}>
                                    {module.moduleName}
                                </Typography>
                            </Card>
                        </Grid>

                    ))}
                    
                </Grid>
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
                    Add Assignment
                </Button>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                PaperProps={{
                style: { height: '50vh', overflow: 'hidden' } 
                }}
                TransitionComponent={Transition}
            >
                <DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                </DialogTitle>

                    <DialogContent sx={{ padding: 0 }}>
                    <Box sx={{ height: '100%', width: '100%', overflowY: 'auto' }}>
                        <AssignmentForm
                        studentData={student}
                        degreeModulesData={degreeModules}
                        />
                    </Box>
                    </DialogContent>
                </Dialog>

            <Box mt={3}>
                { listLoading ? (
                    <Box mt="200px" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress size={150} sx={{ color: colors.blueAccent[100] }} />
                    </Box>
                    ) : listError ? (
                        <div>{listErrorMessage}</div>
                    ) : ( <AssignmentList list={assignmentList} /> )
                }
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
            
        </Box>
        

    )
}

export default StudentProfile