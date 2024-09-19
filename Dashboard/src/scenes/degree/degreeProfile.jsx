import React from 'react'
import { useParams } from 'react-router-dom';
import useFetchSingleDegreeData from '../../hooks/useFetchSingleDegreeData';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { tokens } from '../../theme';

const DegreeProfile = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const { degreeId } = useParams();
    const {degree, loading, error} = useFetchSingleDegreeData(degreeId)
    console.log(degree);
    
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
        <div>DegreeProfile {degreeId} {degree.degreeName}</div>
    )
}

export default DegreeProfile