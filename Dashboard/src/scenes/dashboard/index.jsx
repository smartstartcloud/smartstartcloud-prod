import { Box, Grid, Select, MenuItem, FormControl, InputLabel, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import TaskCard from "../../components/TaskCard";
import { yearFilter } from "../../utils/yearFilter";
import { useAuthContext } from "../../context/AuthContext";
import useFetchAgentFilteredDegreeData from "../../hooks/useFetchAgentFilteredDegreeData";
import SuperAdminCharts from "../../components/profilePages/SuperAdminCharts.jsx";
import { sortByProperty } from "../../utils/functions.js";
import useFetchOrderList from "../../hooks/useFetchOrderList";

const Dashboard = () => {
  const { authUser, isSuperAdmin } = useAuthContext();
  const { degree, error, loading } = useFetchAgentFilteredDegreeData(authUser._id);
  const [selectedIntake, setSelectedIntake] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const yearList = degree ? yearFilter(degree) : [];

  const handleIntakeChange = (event) => setSelectedIntake(event.target.value);
  const handleYearChange = (event) => setSelectedYear(event.target.value);

  // Generate last 10 years dynamically
  const currentYear = new Date().getFullYear();
  const lastTenYears = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Filter Degrees Based on Intake and Year
  let filteredYearList = yearList.filter((year) => {
    const intakeMatch = selectedIntake ? year.yearName.startsWith(selectedIntake) : true;
    const yearMatch = selectedYear ? year.yearName.endsWith(selectedYear) : true;
    return intakeMatch && yearMatch;
  });
  filteredYearList = sortByProperty(filteredYearList, "year_id", "dsc");  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data...</div>;

  return (
    <Box m="20px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Header
          title={isSuperAdmin ? "DASHBOARD" : "MY DEGREES"}
          subtitle={
            isSuperAdmin ? "Welcome to Dashboard" : "Welcome to MY DEGREES"
          }
        />
      </Box>
       

      {!isSuperAdmin && (
        <>
          <Box display="flex" gap={2} mb={3}>
            <FormControl
              variant="outlined"
              size="small"
              style={{ minWidth: 120 }}
            >
              <InputLabel>Intake</InputLabel>
              <Select
                value={selectedIntake}
                onChange={handleIntakeChange}
                label="Intake"
              >
                <MenuItem value="">All</MenuItem>
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              size="small"
              style={{ minWidth: 120 }}
            >
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                label="Year"
              >
                <MenuItem value="">All</MenuItem>
                {lastTenYears.map((year) => (
                  <MenuItem key={year} value={year.toString()}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Grid container spacing={2}>
            {filteredYearList.length > 0 ? (
              filteredYearList.map((year, idx) => (
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
        </>
      )}
      {isSuperAdmin && 
        <SuperAdminCharts />
      }
    </Box>
  );
};

export default Dashboard;
