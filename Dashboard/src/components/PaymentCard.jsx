import React, { useState } from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
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
          <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={2}>
            <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
              {type === "degree" ? "Degree Name" : "For Payment Year"}
            </Typography>
            <Typography variant="subtitle1" component="div">
              {name}
            </Typography>
          </Box>
          {type === "degree" && (
            <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={2}>
              <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
                Degree ID
              </Typography>
              <Typography variant="subtitle1" component="div">
                {id}
              </Typography>
            </Box>
          )}
          <TableContainer component={Paper} sx={{ background: colors.grey[900], color: colors.grey[50] }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: colors.grey[50] }}>Description</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", color: colors.grey[50] }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontSize: "0.8rem", fontWeight: "bold", color: colors.grey[50] }}>
                    Total Approved Amount
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.9rem", fontWeight: "bold", color: colors.greenAccent[300] }}>
                    {totalApprovedPriceTemp}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontSize: "0.8rem", fontWeight: "bold", color: colors.grey[50] }}>
                    Due Amount
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.9rem", fontWeight: "bold", color: colors.redAccent[400] }}>
                    {totalPriceDueTemp}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontSize: "0.8rem", fontWeight: "bold", color: colors.grey[50] }}>
                    Percentage Collected
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: "0.9rem", fontWeight: "bold", color: colors.blueAccent[100] }}>
                    {((totalApprovedPriceTemp / totalModulePriceTemp) * 100).toFixed(2)} %
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default PaymentCard