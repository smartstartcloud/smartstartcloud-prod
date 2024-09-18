import { Box } from '@mui/material'
import Header from '../../components/Header'
import useToken from '../../hooks/useToken'
import TaskCard from '../../components/TaskCard'
// import {degree } from '../../data/mockData'
import { yearFilter } from '../../utils/yearFilter'
import useFetchAllDegreeData from '../../hooks/useFetchAllDegreeData'

const Dashboard = () => {


 // Empty dependency array ensures this runs only once after the first render
 const { degree, error, loading } = useFetchAllDegreeData()
    
  const yearList = degree ? yearFilter(degree) : [];  

  const {handleToken} = useToken()
  
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
        {degree ? yearList.map((year, idx) => (
          <TaskCard key={idx} yearId={year.year_id} taskName={year.yearName} taskDetails={year.degreeList.length} taskAgents={year.agentList} />
        )) : undefined}
      </Box>

      <h1>Make a Protected Request</h1>
      <button onClick={handleToken}>Access Protected Route</button>
    </Box>
  )
}

export default Dashboard