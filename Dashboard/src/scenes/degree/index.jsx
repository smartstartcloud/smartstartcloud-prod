import React from 'react'
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, useTheme } from '@mui/material';
import Header from '../../components/Header';
import { degreeFilter } from '../../utils/yearFilter';
import DegreeCard from '../../components/DegreeCard';
import { tokens } from '../../theme';
import useFetchSelectedDegreeData from '../../hooks/useFetchSelectedDegreeData';

const DegreeBoard = () => {
    const { degreeYear } = useParams();
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    
    const {degree, loading, error} = useFetchSelectedDegreeData(degreeYear)

    const {filteredDegree, yearName} = degree ? degreeFilter(degree, degreeYear) : {}
    
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
    <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title={`All degrees of ${yearName}`} subtitle={"Here is all the information listed in your Assignment"} />
        </Box>
        <Box display="flex" gap="20px">
            { filteredDegree.map((degree) => (
            <DegreeCard key={degree.degreeID} degreeYear={degreeYear} degreeId={degree.degreeID} degreeName={degree.degreeName} totalStudents={degree.degreeStudentList.length} degreeAgent={degree.degreeAgent} />
            )) }
        </Box>
    </Box>
    )
}

export default DegreeBoard