import React, { useState } from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from '../theme';


const PaymentCard = ({id='', name, data, type}) => {      
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  
  
  // Check if data is defined and is an array
  const totalModulePriceTemp = Array.isArray(data)
    ? data.reduce((sum, item) => sum + Number(item.modulePrice || 0), 0)
    : 0;

  const totalPaidPriceTemp = Array.isArray(data)
    ? data.reduce((sum, item) => sum + Number(item.paidAmount || 0), 0)
    : 0;

  const totalApprovedPriceTemp = Array.isArray(data)
    ? data.reduce(
        (sum, item) =>
          item.paymentVerificationStatus === "approved"
            ? sum + Number(item.paidAmount || 0)
            : sum,
        0
      )
    : 0;

  const totalWaitingApprovalPriceTemp = Array.isArray(data)
    ? data.reduce(
        (sum, item) =>
          item.paymentVerificationStatus === "awaiting approval"
            ? sum + Number(item.paidAmount || 0)
            : sum,
        0
      )
    : 0;

    const totalPriceDueTemp = Array.isArray(data)
    ? data.reduce((sum, item) => sum + Number(item.totalPaymentDue || 0), 0)
    : 0;   
    
  return (
    <Card
      sx={{
        minWidth: "100%",
        // background: `linear-gradient(210deg, ${colors.blueAccent[500]}, ${colors.blueAccent[700]})`,
        background: colors.blueAccent[800],
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: "10px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        },
        color: colors.grey[50],
      }}
    >
      <CardActionArea>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="baseline"
            mb={2}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {type === "degree" ? "Degree Name" : "Year Name"}
            </Typography>
            <Typography variant="subtitle1" component="div">
              {name}
            </Typography>
          </Box>
          {type === "degree" && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="baseline"
              mb={2}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                Degree ID
              </Typography>
              <Typography variant="subtitle1" component="div">
                {id}
              </Typography>
            </Box>
          )}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="baseline"
            mb={2}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {"Collected Amount"}
            </Typography>
            <Typography variant="subtitle1" component="div">
              {totalPaidPriceTemp}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="baseline"
            mb={2}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {"Due Amount"}
            </Typography>
            <Typography variant="subtitle1" component="div">
              {totalPriceDueTemp}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="baseline"
            mb={2}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {"Percentage Collected"}
            </Typography>
            <Typography variant="subtitle1" component="div">
              {((totalPaidPriceTemp/totalModulePriceTemp)*100).toFixed(2)} %
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default PaymentCard