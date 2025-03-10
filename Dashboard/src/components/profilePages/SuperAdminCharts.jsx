import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import useAllGetPaymentDetails from "../../hooks/useGetAllPaymentDetails.js";
import { tokens } from "../../theme.js";
import PaymentCard from "../PaymentCard.jsx";
import { formatDateString, yearFilter } from "../../utils/yearFilter.js";
import BarChart from "../../components/BarChart.jsx";
import PaymentDetailsDashboard from "../PaymentDetailsDashboard.jsx";
import { sortByProperty } from "../../utils/functions.js";


const SuperAdminCharts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [chartStatus, setChartStatus] = useState("degree");
  const [groupedData, setGroupedData] = useState([]);
  const [filteredYearList, setFilteredYearList] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [paymentDetailsData, setPaymentDetailsData] = useState({});
  const { paymentData, error, loading } = useAllGetPaymentDetails();

  const [selectedIntake, setSelectedIntake] = useState("");
  const [selectedYear, setSelectedYear] = useState("");  
 
  useEffect(() => {        
    if (paymentData && chartStatus) {
      dataFilter(paymentData, chartStatus);      
    }
  }, [paymentData, chartStatus]);

  const dataFilter = (paymentData, chartStatus) => {
    if (chartStatus === "degree") {
      const groupedData = paymentData.reduce((acc, item) => {
        const { degreeID, degreeName, degreeYear } = item;

        // Check if the degreeID group exists
        let group = acc.find((group) => group.degreeID === degreeID);
        if (!group) {
          // If not, create a new group
          group = {
            degreeID,
            dataName : degreeName,
            dataYear: degreeYear,
            data: [],
          };
          acc.push(group);
        }

        // Add the current item to the degreeData array
        group.data.push(item);

        return acc;
      }, []);
      setGroupedData(groupedData);      
      setChartData([]);
      // barChartData(groupedData);
    }
    // if (chartStatus === "year") {    
    //   const groupedData = paymentData.reduce((acc, item) => {
    //     const { degreeYear } = item;
    //     // Check if the degreeYear group exists
    //     let group = acc.find((group) => group.dataName === degreeYear);        
    //     if (!group) {          
    //       // If not, create a new group
    //       group = {
    //         dataName: degreeYear,
    //         data: [],
    //       };
    //       acc.push(group);
    //     }

    //     // Add the current item to the yearData array
    //     group.data.push(item);
    //     return acc;
    //   }, []);      
    //   setGroupedData(groupedData);
    //   setChartData([])
    //   barChartData(groupedData);
    // }
  };

  
  const yearList = groupedData || [];
  const handleIntakeChange = (event) => setSelectedIntake(event.target.value);
  const handleYearChange = (event) => setSelectedYear(event.target.value);

  const currentYear = new Date().getFullYear();
  const lastTenYears = Array.from({ length: 10 }, (_, i) => currentYear - i);
  
  useEffect(() => {
    let filtered = yearList.filter((data) => {
      const intakeMatch = selectedIntake ? data.dataYear.startsWith(selectedIntake.toString().toLowerCase()) : true;    
      const yearMatch = selectedYear ? data.dataYear.endsWith(selectedYear) : true;
      return intakeMatch && yearMatch;
    });
    
    filtered = sortByProperty(filtered, "dataYear", "dsc");
    setFilteredYearList(filtered);
    setPaymentDetailsData({})
  }, [yearList, selectedIntake, selectedYear]); // Dependencies to re-run the effect

  // const barChartData = (paymentData) => {        
  //   paymentData.forEach((element) => {
  //     const totalPaidPriceTemp = Array.isArray(element.data)
  //       ? element.data.reduce(
  //           (sum, item) => sum + Number(item.paidAmount || 0),
  //           0
  //         )
  //       : 0;
  //     const tempObj = {
  //       label: element.dataName,
  //       paidAmount: totalPaidPriceTemp,
  //     };
  //     setChartData((prevData) => [...prevData, tempObj]);
  //   });
  // };

  const handlePaymentCardClick = (dataName, data) => {
    setPaymentDetailsData({ dataName, dataDetails: data });
  };

  if (loading) {
    return (
      <Box
        mt="200px"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress size={150} sx={{ color: colors.blueAccent[100] }} />
      </Box>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <Box pb={2}>
      {/* Additional */}
      <Box display="flex" gap={2} mb={3}>
        <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
          <InputLabel>Intake</InputLabel>
          <Select
            value={selectedIntake}
            onChange={handleIntakeChange}
            label="Intake"
          >
            <MenuItem value="">All</MenuItem>
            {["January", "June", "September"].map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select value={selectedYear} onChange={handleYearChange} label="Year">
            <MenuItem value="">All</MenuItem>
            {lastTenYears.map((year) => (
              <MenuItem key={year} value={year.toString()}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2} mb={2}>
        {filteredYearList && filteredYearList.length > 0 ? (
          filteredYearList.map(({ degreeID, dataName, data }, index) => (
            <Grid
              item
              xs={12}
              sm={3}
              key={index}
              onClick={() => handlePaymentCardClick(dataName, data)}
            >
              <Box display="flex" flexDirection="column" gap={2}>
                <PaymentCard
                  id={degreeID}
                  name={dataName}
                  data={data}
                  type={chartStatus}
                />
              </Box>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h5">No Data</Typography>
          </Grid>
        )}
      </Grid>
      {/* Additional */}

      {/* <Grid container spacing={2} mb={5}>
        <Grid item xs={12} gap={2} display="flex">
          <Button
            onClick={() => setChartStatus("degree")}
            color="secondary"
            variant={chartStatus === "degree" ? "contained" : "outlined"} // or "outlined" based on your styling preference
          >
            BY DEGREE
          </Button>
          <Button
            onClick={() => setChartStatus("year")}
            color="secondary"
            variant={chartStatus === "year" ? "contained" : "outlined"} // or "outlined" based on your styling preference
          >
            BY YEAR
          </Button>
        </Grid>
      </Grid> */}
      <Grid container spacing={2} mb={2}>
        {/* <Grid item xs={12} md={4}>
          <Box width="100%" height="300px" m="0 auto" border="1px solid #000">
            <BarChart data={chartData} type={chartStatus} />
          </Box>
        </Grid> */}
        <Grid item xs={12}>
          <PaymentDetailsDashboard
            data={paymentDetailsData}
            type={chartStatus}
          />
        </Grid>
      </Grid>
      {/* {chartStatus === "degree" && (
        <Grid container spacing={2}>
          {groupedData && groupedData.length > 0 ? (
            groupedData.map(({ degreeID, dataName, data }, index) => (
              <Grid
                item
                xs={12}
                sm={3}
                key={index}
                onClick={() => handlePaymentCardClick(dataName, data)}
              >
                <Box display="flex" flexDirection="column" gap={2}>
                  <PaymentCard
                    id={degreeID}
                    name={dataName}
                    data={data}
                    type={chartStatus}
                  />
                </Box>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h5">No Data</Typography>
            </Grid>
          )}
        </Grid>
      )}
      {chartStatus === "year" && (
        <Grid container spacing={2}>
          {groupedData && groupedData.length > 0 ? (
            groupedData.map(({ dataName, data }, index) => (
              <Grid
                item
                xs={12}
                sm={3}
                key={index}
                onClick={() => handlePaymentCardClick(dataName, data)}
              >
                <PaymentCard
                  name={formatDateString(dataName)}
                  data={data}
                  type={chartStatus}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h5">No Data</Typography>
            </Grid>
          )}
        </Grid>
      )} */}
    </Box>
  );
};

export default SuperAdminCharts;
