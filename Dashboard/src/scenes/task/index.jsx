import React from 'react'
import { useParams } from 'react-router-dom';
import { taskData } from '../../data/mockData';
import { Box } from '@mui/material';
import Header from '../../components/Header';
import SubTaskAccordion from '../../components/SubTaskAccordion';

const MainTask = () => {
    const { taskId } = useParams();
    const assignments = taskData
    const filteredAssignment = assignments.filter((assignment)=>{
        return assignment.taskId === Number(taskId)
    })[0]
    
    return (
    <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title={filteredAssignment.taskName} subtitle={"Here is all the information listed in your Assignment"} />
        </Box>
        <Box>
            {filteredAssignment.taskContents && filteredAssignment.taskContents.map((subTask)=>(
                <SubTaskAccordion taskTable={subTask} />
            ))}
        </Box>
    </Box>
    )
}

export default MainTask