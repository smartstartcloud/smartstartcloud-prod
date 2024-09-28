import React from 'react'
import { useLocation, useParams } from 'react-router-dom';
import useFetchSingleStudentData from '../../hooks/useFetchSingleStudentData';
import { Box, Card, CardContent, CircularProgress, Divider, Grid, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';

const StudentProfile = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { studentId } = useParams();
    const location = useLocation(); // Access the passed state
    const {student, loading, error} = useFetchSingleStudentData(studentId);
    const { studentName, studentContact, studentLogin, studentPassword, studentAssignment = [] } = student || {};
    const { degreeModules } = location.state || {};
    const taken = ['204']

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
                                                sx={{ textAlign: 'center', mb: 1,  textDecoration: taken.includes(module.moduleCode) ? 'none' : 'line-through' }}
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
        </Box>

    )
}

export default StudentProfile