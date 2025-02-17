import { Box, Button, CircularProgress, Grid, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import useAllGetPaymentDetails from "../../hooks/useGetAllPaymentDetails.js";
import { tokens } from "../../theme.js";
import PaymentCard from "../PaymentCard.jsx";
import { formatDateString } from "../../utils/yearFilter.js";
import BarChart from "../../components/BarChart.jsx";

const SuperAdminCharts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [chartStatus, setChartStatus] = useState("degree");
  const [groupedData, setGroupedData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const { paymentData, error, loading } = useAllGetPaymentDetails();

  useEffect(() => {
    if (paymentData && chartStatus) {
      dataFilter(paymentData, chartStatus);
    }
  }, [paymentData, chartStatus]);

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
            dataName : degreeName,
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
      barChartData(groupedData);
    }
    if (chartStatus === "year") {    
      const groupedData = paymentData.reduce((acc, item) => {
        const { degreeYear } = item;
        // Check if the degreeYear group exists
        let group = acc.find((group) => group.dataName === degreeYear);        
        if (!group) {          
          // If not, create a new group
          group = {
            dataName: degreeYear,
            data: [],
          };
          acc.push(group);
        }

        // Add the current item to the yearData array
        group.data.push(item);
        return acc;
      }, []);      
      setGroupedData(groupedData);
      setChartData([])
      barChartData(groupedData);
    }
  };

  const barChartData = (paymentData) => {        
    paymentData.forEach((element) => {
      const totalPaidPriceTemp = Array.isArray(element.data)
        ? element.data.reduce(
            (sum, item) => sum + Number(item.paidAmount || 0),
            0
          )
        : 0;
      const tempObj = {
        label: element.dataName,
        paidAmount: totalPaidPriceTemp,
      };
      setChartData((prevData) => [...prevData, tempObj]);
    });
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
    <Box>
      <Grid container spacing={2} mb={5}>
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
      </Grid>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12}>
          <Box width="60%" height="300px" m="0 auto" border="1px solid #000">
            <BarChart data={chartData} type={chartStatus} />
          </Box>
        </Grid>
      </Grid>
      {chartStatus === "degree" && (
        <Grid container spacing={2}>
          {groupedData && groupedData.length > 0 ? (
            groupedData.map(({ degreeID, dataName, data }) => (
              <Grid item xs={12} sm={3} key={degreeID}>
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
              <Grid item xs={12} sm={3} key={index}>
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
      )}
    </Box>
  );
};

export default SuperAdminCharts;
