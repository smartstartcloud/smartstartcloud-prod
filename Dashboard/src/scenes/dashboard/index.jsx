import { Box, Grid, Typography } from '@mui/material'
import Header from '../../components/Header'
import TaskCard from '../../components/TaskCard'
// import {degree } from '../../data/mockData'
import { yearFilter } from '../../utils/yearFilter'

// Test
import { useAuthContext } from '../../context/AuthContext'
import useFetchAgentFilteredDegreeData from '../../hooks/useFetchAgentFilteredDegreeData'
import BarChart from '../../components/BarChart.jsx'

import {
  mockBarDataBusiness1234,
  mockBarDataBusNTour,
  FY_CCCU_Business_and_Tourism,
} from "../../data/mockData.js";
// Test

const Dashboard = () => {

 // Empty dependency array ensures this runs only once after the first render
  const { authUser, isSuperAdmin } = useAuthContext();
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
      {!isSuperAdmin && (
        <Grid container spacing={2}>
          {yearList.length > 0 ? (
            yearList
              .sort((a, b) => {
                const dateA = new Date(a.yearName); // Assuming yearName is in "Month YYYY" format
                const dateB = new Date(b.yearName);
                return dateA - dateB;
              })
              .map((year, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={idx}>
                  <TaskCard
                    yearId={year.year_id}
                    taskName={year.yearName}
                    taskDetails={year.degreeList.length}
                    taskAgents={year.agentList}
                    filterByAgent={true}
                  />
                </Grid>
              ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h3">No Degree to Display</Typography>
            </Grid>
          )}
        </Grid>
      )}
      {isSuperAdmin && (
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h5">Business 1234</Typography>
            <Box width="100%" height="250px" border="1px solid #000">
              <BarChart data={mockBarDataBusiness1234} />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5"> Bus and Tour </Typography>
            <Box width="100%" height="250px" border="1px solid #000">
              <BarChart data={mockBarDataBusNTour} />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">FY-CCCU Business and Tourism</Typography>
            <Box width="100%" height="250px" border="1px solid #000">
              <BarChart data={FY_CCCU_Business_and_Tourism} />
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Dashboard