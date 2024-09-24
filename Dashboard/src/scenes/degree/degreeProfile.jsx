import React from 'react'
import { useParams } from 'react-router-dom';
import useFetchSingleDegreeData from '../../hooks/useFetchSingleDegreeData';
import { Box, Card, CardContent, CircularProgress, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { mockDataContacts } from "../../data/mockData"


const DegreeProfile = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const { degreeId } = useParams();
    const {degree, loading, error} = useFetchSingleDegreeData(degreeId)
    
    const {degreeName, degreeAgent, degreeStudentList, degreeModules} = degree || {};
    
    const studentList = degreeStudentList || []

    const columns = [
        {field: "studentID", headerName: "STUDENT ID", flex: .5},
        {field: "studentName", headerName: "Name", flex: 1},
        {field: "studentLogin", headerName: "User Name", flex: 1},
        {field: "studentPassword", headerName: "Password", flex: 1},
        {field: "studentContact", headerName: "Phone Number", flex: 1},
    ]
    
    // Handle loading and error states
    if (loading) {
        return (
            <Box mt="200px" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress 
                    size={150}
                    sx={{color: colors.blueAccent[100]}}    
                />
            </Box>
        )
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    return (
        <Box m='20px'>
            <Card
                sx={{
                    maxWidth: '50%',
                    margin: 'auto',
                    my: 2,
                    boxShadow: 3,
                    background: colors.blueAccent[500],
                    borderRadius: 2,
                    '&:hover': {
                    boxShadow: 6,
                    },
                }}
                >
                <CardContent>
                    <Typography
                        variant="h2"
                        component="div"
                        sx={{ fontWeight: 'bold', mb: 1 }}
                        color={colors.grey[900]}
                        >
                            Degree Information
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="h4" color={colors.grey[900]}>
                            <strong>Degree ID:</strong> {degreeId}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="h4" color={colors.grey[900]}>
                            <strong>Degree Name:</strong> {degreeName}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h4" color={colors.grey[900]}>
                            <strong>Agent Enlisted:</strong> {`${degreeAgent.firstName} ${degreeAgent.lastName}`}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
            <DataGrid
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
                pageSizeOptions={[5]}
            />
        </Box>
    )
}

export default DegreeProfile