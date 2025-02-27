import { Box, Grid, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useState } from "react";
import Header from "../../components/Header";
import useFetchAllDegreeData from "../../hooks/useFetchAllDegreeData";
import TaskCard from "../../components/TaskCard";
import { yearFilter } from "../../utils/yearFilter";
import { sortByProperty } from "../../utils/functions";

const AllDegree = () => {
  const { degree, error, loading } = useFetchAllDegreeData();
  const [selectedIntake, setSelectedIntake] = useState("");
  const [selectedYear, setSelectedYear] = useState("");  

  const yearList = degree ? yearFilter(degree) : [];

  const handleIntakeChange = (event) => setSelectedIntake(event.target.value);
  const handleYearChange = (event) => setSelectedYear(event.target.value);

  const currentYear = new Date().getFullYear();
  const lastTenYears = Array.from({ length: 10 }, (_, i) => currentYear - i);
  
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="ALL YEARS" subtitle="All existing years are displayed." />
      </Box>
      
      <Box display="flex" gap={2} mb={3}>
        <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
          <InputLabel>Intake</InputLabel>
          <Select value={selectedIntake} onChange={handleIntakeChange} label="Intake">
            <MenuItem value="">All</MenuItem>
            {[
              "January",  "June", "September"
            ].map((month) => (
              <MenuItem key={month} value={month}>{month}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select value={selectedYear} onChange={handleYearChange} label="Year">
            <MenuItem value="">All</MenuItem>
            {lastTenYears.map((year) => (
              <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {filteredYearList.map((year, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={idx}>
            <TaskCard
              yearId={year.year_id}
              taskName={year.yearName}
              taskDetails={year.degreeList.length}
              taskAgents={year.agentList}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AllDegree;
