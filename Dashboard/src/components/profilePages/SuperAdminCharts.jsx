import { Box, Button, CircularProgress, Grid, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import useAllGetPaymentDetails from "../../hooks/useGetAllPaymentDetails.js";
import { tokens } from "../../theme.js";
import PaymentCard from "../PaymentCard.jsx";
import { formatDateString } from "../../utils/yearFilter.js";
import BarChart from "../../components/BarChart.jsx";

import {
  mockBarDataBusiness1234,
  mockBarDataBusNTour,
  FY_CCCU_Business_and_Tourism,
} from "../../data/mockData.js";

const SuperAdminCharts = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [chartStatus, setChartStatus] = useState("degree");
    const [groupedData, setGroupedData] = useState([]);
    const { paymentData, error, loading } = useAllGetPaymentDetails();


    const dataFilter = (paymentData, chartStatus) => {
      if (chartStatus === "degree") {
        const groupedData = paymentData.reduce((acc, item) => {
          const { degreeID, degreeName } = item;

          // Check if the degreeID group exists
          let group = acc.find((group) => group.degreeID === degreeID);
          if (!group) {
            // If not, create a new group
            group = {
              degreeID,
              degreeName,
              degreeData: [],
            };
            acc.push(group);
          }

          // Add the current item to the degreeData array
          group.degreeData.push(item);

          return acc;
        }, []);
        setGroupedData(groupedData);
      }

      if (chartStatus === "year") {
        const groupedData = paymentData.reduce((acc, item) => {
          const { degreeYear } = item;

          // Check if the degreeYear group exists
          let group = acc.find((group) => group.degreeYear === degreeYear);
          if (!group) {
            // If not, create a new group
            group = {
              degreeYear,
              yearData: [],
            };
            acc.push(group);
          }

          // Add the current item to the yearData array
          group.yearData.push(item);

          return acc;
        }, []);
        setGroupedData(groupedData);
      }
    };

    useEffect(() => {
      if (paymentData) {
        dataFilter(paymentData, chartStatus);
      }
    }, [chartStatus]);

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
      {chartStatus === "degree" && (
        <Grid container spacing={2}>
          {groupedData && groupedData.length > 0 ? (
            groupedData.map(({ degreeID, degreeName, degreeData }) => (
              <Grid item xs={12} sm={6} key={degreeID}>
                <Typography mb={2} variant="h5">
                  {degreeName}
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box width="50%">
                    <PaymentCard
                      id={degreeID}
                      name={degreeName}
                      data={degreeData}
                    />
                  </Box>

                  <Box width="50%" height="250px" border="1px solid #000">
                    <BarChart data={mockBarDataBusiness1234} />
                  </Box>
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
            groupedData.map(
              ({ degreeID, degreeYear: degreeName, yearData: degreeData }) => (
                <Grid item xs={3} key={degreeID}>
                  <Typography mb={2} variant="h5">
                    {degreeName}
                  </Typography>
                  <PaymentCard
                    id={degreeID}
                    name={degreeName}
                    data={degreeData}
                  />
                </Grid>
              )
            )
          ) : (
            <Grid item xs={12}>
              <Typography variant="h5">No Data</Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default SuperAdminCharts;
