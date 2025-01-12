import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import BarChart from "../../components/BarChart.jsx";

import {
  mockBarDataBusiness1234,
  mockBarDataBusNTour,
  FY_CCCU_Business_and_Tourism,
} from "../../data/mockData.js";
import useAllGetPaymentDetails from "../../hooks/useGetAllPaymentDetails.js";

const SuperAdminCharts = () => {
    const [chartStatus, setChartStatus] = useState("degree");
    const { paymentData } = useAllGetPaymentDetails(chartStatus);
    console.log(paymentData);
    
    useEffect(() => {
        console.log(chartStatus);
    }, [chartStatus]);
  return (
    <Box>
      <Grid container spacing={2} mb={5}>
        <Grid item xs={12} gap={2} display="flex">
          <Button
            onClick={() => setChartStatus("degree")}
            color="secondary"
            variant="contained" // or "outlined" based on your styling preference
          >
            BY DEGREE
          </Button>
          <Button
            onClick={() => setChartStatus("year")}
            color="secondary"
            variant="contained" // or "outlined" based on your styling preference
          >
            BY YEAR
          </Button>
        </Grid>
      </Grid>
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
    </Box>
  );
};

export default SuperAdminCharts;
