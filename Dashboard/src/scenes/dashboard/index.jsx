import { Box } from '@mui/material'
import React from 'react'
import Header from '../../components/Header'
import { useTokenContext } from '../../context/TokenContext'

const Dashboard = () => {
    const {accessToken} = useTokenContext()

    const handleToken = async () => {
      if (!accessToken) {
        alert('You need to login first!');
        return;
      }

      const res = await fetch('http://localhost:5000/dummyRequest', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      const data = await res.json();
      console.log(data);
      
    }
    
    
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