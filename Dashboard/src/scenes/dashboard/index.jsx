import { Box, Typography } from '@mui/material'
import Header from '../../components/Header'
import useToken from '../../hooks/useToken'
import TaskCard from '../../components/TaskCard'
// import {degree } from '../../data/mockData'
import { yearFilter } from '../../utils/yearFilter'
import useFetchAllDegreeData from '../../hooks/useFetchAllDegreeData'

// Test
import { jwtDecode } from 'jwt-decode';
import DynamicBreadcrumbs from '../../components/DynamicBreadcrumbs'
import { useAuthContext } from '../../context/AuthContext'
import { useEffect } from 'react'
import useFetchAgentFilteredDegreeData from '../../hooks/useFetchAgentFilteredDegreeData'
// Test

const Dashboard = () => {

 // Empty dependency array ensures this runs only once after the first render
  const { authUser } = useAuthContext()
  const { degree, error, loading } = useFetchAgentFilteredDegreeData(authUser._id);
    
  const yearList = degree ? yearFilter(degree) : [];  
  
  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data...</div>;
  }


  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title={"DASHBOARD"} subtitle={"Welcome to Dashboard"} />
      </Box>
      <Box display="flex" gap="20px">
        {yearList.length > 0 ? (
          yearList
            .sort((a, b) => {
              const dateA = new Date(a.yearName); // Assuming yearName is in "Month YYYY" format
              const dateB = new Date(b.yearName);
              return dateA - dateB;
            })
            .map((year, idx) => (
              <TaskCard
                key={idx}
                yearId={year.year_id}
                taskName={year.yearName}
                taskDetails={year.degreeList.length}
                taskAgents={year.agentList}
                filterByAgent={true}
              />
            ))
        ) : (
          <Typography variant="h3">No Degree to Display</Typography>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard