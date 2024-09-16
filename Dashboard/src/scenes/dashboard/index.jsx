import { Box } from '@mui/material'
import React from 'react'
import Header from '../../components/Header'
import useToken from '../../hooks/useToken'
import TaskCard from '../../components/TaskCard'
import {degree } from '../../data/mockData'
import { yearFilter } from '../../utils/yearFilter'

const Dashboard = () => {
  const yearList = yearFilter(degree)  
  console.log(yearList);
  

  const {handleToken} = useToken()
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={"DASHBOARD"} subtitle={"Welcome to Dashboard"} />
      </Box>
      <Box display="flex" gap="20px">
        { yearList.map((year, idx) => (
          <TaskCard key={idx} taskId={year.year_id} taskName={year.yearName} taskDetails={year.degreeList.length} taskAgents={year.agentList} />
        )) }
      </Box>

      <h1>Make a Protected Request</h1>
      <button onClick={handleToken}>Access Protected Route</button>
    </Box>
  )
}

export default Dashboard