import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import {
  Box,
  Typography,
  useTheme,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { tokens } from "../../theme";
import { enumToString, formatDate } from "../../utils/functions";

const PaymentFormSingle = ({
  paymentDetails,
  handleChange,
  setFileUploadModalOpen,
}) => {  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isApproved, setIsApproved] = useState(false)

  useEffect(() => {
    setIsApproved(() => paymentDetails.paymentVerificationStatus === "approved");
  }, [paymentDetails]);

  return (
    <Box display="flex" py={2}>
      <Box flexGrow={3}>
        <Typography variant="h5" color={colors.grey[50]} sx={{ mb: 2 }}>
          Add Payment Details Form
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="payment-status-label">Payment Plan</InputLabel>
              <Select
                labelId="payment-plan-label"
                id="payment-plan"
                label="Payment plan"
                value={paymentDetails.paymentPlan}
                onChange={(e) => handleChange("paymentPlan", e.target.value)}
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
                disabled={isApproved}
              >
                <MenuItem value="year">Whole year plan</MenuItem>
                <MenuItem value="installment">
                  Whole year - 2 instalment plan
                </MenuItem>
                <MenuItem value="individual">Individual plan</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Payment Note"
              fullWidth
              value={paymentDetails.note}
              onChange={(e) => handleChange("note", e.target.value)}
              sx={{ mb: 2 }}
              disabled={isApproved}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Payment Amount"
              fullWidth
              type="number"
              value={paymentDetails.paymentAmount}
              onChange={(e) => handleChange("paymentAmount", e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ min: 0 }} // Optional: Prevents negative values
              disabled={isApproved}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Paid Amount"
              fullWidth
              type="number"
              value={paymentDetails.paidAmount}
              onChange={(e) => handleChange("paidAmount", e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ min: 0 }} // Optional: Prevents negative values
              disabled={isApproved}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Total Payment Due"
              fullWidth
              type="number"
              value={paymentDetails.totalPaymentDue}
              onChange={(e) => handleChange("totalPaymentDue", e.target.value)}
              sx={{ mb: 2 }}
              disabled={isApproved}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="payment-status-label">Payment Status</InputLabel>
              <Select
                labelId="payment-status-label"
                id="payment-status"
                label="Payment Status"
                value={paymentDetails.paymentStatus}
                onChange={(e) => handleChange("paymentStatus", e.target.value)}
                variant="outlined"
                fullWidth
                required
                sx={{ mb: 2 }}
                disabled={isApproved}
              >
                <MenuItem value="NP">OUTSTANDING</MenuItem>
                <MenuItem value="PP">PARTIALLY PAID</MenuItem>
                <MenuItem value="PAID">PAID</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                sx={{ width: "100%", mb: 2 }}
                disabled={isApproved}
                label="Total Payment to Date"
                format="dd/MM/yyyy" // Custom date format
                value={
                  paymentDetails.totalPaymentToDate
                    ? new Date(paymentDetails.totalPaymentToDate)
                    : null
                } // Ensure the value is a Date object
                onChange={(newValue) => {
                  handleChange(
                    "totalPaymentToDate",
                    newValue.toISOString() || null
                  );
                }}
                slotProps={{
                  textField: { fullWidth: true, variant: "outlined" },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} display="flex" alignItems="center">
            <Chip
              label={enumToString(
                "paymentVerificationStatus",
                paymentDetails.paymentVerificationStatus
              )}
              sx={{
                width: "100%",
                borderRadius: 1,
                mb: 2,
                backgroundColor:
                  paymentDetails.paymentVerificationStatus ===
                    "awaiting approval" ||
                  paymentDetails.paymentVerificationStatus === "rejected"
                    ? "#db4f4a" // Red for awaiting approval
                    : paymentDetails.paymentVerificationStatus === "approved"
                    ? "#4cceac" // Green for approved
                    : "#858585", // Default grey
                color:
                  paymentDetails.paymentVerificationStatus ===
                  "awaiting approval"
                    ? "#fff"
                    : paymentDetails.paymentVerificationStatus === "approved"
                    ? "#000"
                    : "#fff",
                px: 2, // Padding for better appearance
                fontWeight: "bold",
                fontSize: 14,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="payment-method-label">Payment Method</InputLabel>
              <Select
                labelId="payment-method-label"
                label="Payment Method"
                value={paymentDetails.paymentMethod}
                onChange={(e) => handleChange("paymentMethod", e.target.value)}
                fullWidth
                disabled={isApproved}
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="bank">Bank</MenuItem>
                <MenuItem value="referral">Referral</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            {paymentDetails.paymentMethod === "bank" && (
              <TextField
                label="Specify The Bank"
                fullWidth
                value={paymentDetails.bankPaymentMethod}
                onChange={(e) =>
                  handleChange("bankPaymentMethod", e.target.value)
                }
                sx={{ mb: 2 }}
                disabled={isApproved}
              />
            )}
            {paymentDetails.paymentMethod === "cash" && (
              <TextField
                label="Who collected the payment"
                fullWidth
                value={paymentDetails.cashPaymentMethod}
                onChange={(e) =>
                  handleChange("cashPaymentMethod", e.target.value)
                }
                sx={{ mb: 2 }}
                disabled={isApproved}
              />
            )}
            {paymentDetails.paymentMethod === "referral" && (
              <TextField
                label="Referred Person"
                fullWidth
                value={paymentDetails.referredPaymentMethod}
                onChange={(e) =>
                  handleChange("referredPaymentMethod", e.target.value)
                }
                sx={{ mb: 2 }}
                disabled={isApproved}
              />
            )}
            {paymentDetails.paymentMethod === "other" && (
              <TextField
                label="Specify Other Payment Method"
                fullWidth
                value={paymentDetails.otherPaymentMethod}
                onChange={(e) =>
                  handleChange("otherPaymentMethod", e.target.value)
                }
                sx={{ mb: 2 }}
                disabled={isApproved}
              />
            )}
          </Grid>
        </Grid>
        {paymentDetails.paymentMethod === "bank" && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Payee Name"
                fullWidth
                value={paymentDetails.bankPayeeName}
                onChange={(e) => handleChange("bankPayeeName", e.target.value)}
                sx={{ mb: 2 }}
                disabled={isApproved}
              />
            </Grid>
          </Grid>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                width: "100%",
                backgroundColor: colors.greenAccent[500],
                "&:hover": {
                  backgroundColor: colors.greenAccent[600],
                },
              }}
              onClick={() => setFileUploadModalOpen(true)}
            >
              File Upload
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Divider orientation="vertical" flexItem sx={{ mx: "10px" }} />
      <Box flexGrow={2}>
        <Typography variant="h5" color={colors.grey[50]} sx={{ mb: 2 }}>
          Payment Details
        </Typography>
        {paymentDetails.paymentLog && paymentDetails.paymentLog.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "400px", overflowX: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Date</b>
                  </TableCell>
                  <TableCell>
                    <b>Message</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentDetails.paymentLog.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(row.date)}</TableCell>
                    <TableCell>{row.logString}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h5" color={colors.grey[50]} sx={{ mb: 2 }}>
            NO DATA
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PaymentFormSingle;
