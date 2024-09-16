import React from 'react'
import { useParams } from 'react-router-dom';
import { degree } from '../../data/mockData';
import { Box } from '@mui/material';
import Header from '../../components/Header';
import { degreeFilter } from '../../utils/yearFilter';
import DegreeCard from '../../components/DegreeCard';

const MainTask = () => {
    const { taskId } = useParams();
    
    const {filteredDegree, yearName} = degreeFilter(degree, taskId)
    
    return (
    <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title={`All degrees of ${yearName}`} subtitle={"Here is all the information listed in your Assignment"} />
        </Box>
        <Box display="flex" gap="20px">
            { filteredDegree.map((degree) => (
            <DegreeCard key={degree.degreeID} taskId={taskId} degreeId={degree.degreeID} degreeName={degree.degreeName} totalStudents={degree.degreeStudentList.length} degreeAgent={degree.degreeAgent} />
            )) }
        </Box>
    </Box>
    )
}

export default MainTask