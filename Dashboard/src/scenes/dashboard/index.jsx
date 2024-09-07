import { Box } from '@mui/material'
import React from 'react'
import Header from '../../components/Header'
import useToken from '../../hooks/useToken'
import TaskCard from '../../components/TaskCard'
import {taskData } from '../../data/mockData'

const Dashboard = () => {
  const assignments = taskData
  
  const {handleToken} = useToken()
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={"DASHBOARD"} subtitle={"Welcome to Dashboard"} />
      </Box>
      <Box display="flex" gap="20px">
        { assignments.map((assignment) => (
          <TaskCard key={assignment.taskId} taskId={assignment.taskId} taskName={assignment.taskName} taskDetails={assignment.taskDetails} />
        )) }
      </Box>

      <h1>Make a Protected Request</h1>
      <button onClick={handleToken}>Access Protected Route</button>
    </Box>
  )
}

export default Dashboard