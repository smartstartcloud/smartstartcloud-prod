import { Box } from '@mui/material'
import React from 'react'
import Header from '../../components/Header'
import useToken from '../../hooks/useToken'

const Dashboard = () => {
    const {handleToken} = useToken()
    return (
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title={"DASHBOARD"} subtitle={"Welcome to Dashboard"} />
        </Box>
        <h1>Make a Protected Request</h1>
        <button onClick={handleToken}>Access Protected Route</button>
      </Box>
    )
}

export default Dashboard