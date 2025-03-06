import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";
import MuiAlert from "@mui/material/Alert";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Button,
  Modal,
  Snackbar,
  IconButton,
  Alert,
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
import { tokens } from '../../theme';
import useGetPaymentDetails from '../../hooks/useGetPaymentDetails';
import useSendPaymentData from '../../hooks/useSendPaymentData';
import { enumToString, formatDate } from '../../utils/functions';
import { useAuthContext } from '../../context/AuthContext';
import FileUpload from '../FileUpload';
import useFetchModuleAssignmentData from '../../hooks/useFetchModuleAssignmentData';

const PaymentForm = ({ open, setOpen, paymentRequiredInformation }) => {     
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);    
  
  const [formSaved, setFormSaved] = useState(false);
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [formLoading, setformLoading] = useState(false);
  const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false);

  const [referenceIdToPass, setreferenceIdToPass] = useState("");
  
  const { paymentData, loading, error } = useGetPaymentDetails(paymentRequiredInformation);
  
  const { updatePayment } = useSendPaymentData();
  
  const [paymentDetails, setPaymentDetails] = useState({
    paymentPlan: "",
    note: "",
    totalPaymentDue: "",
    totalPaymentToDate: "",
    paymentMethod: "",
    paymentAmount: "",
    paymentStatus: "",
    paidAmount: "",
    otherPaymentMethod: "", // Additional field for "Other"
    bankPaymentMethod: "", // Additional field for "Bank Transfer",
    cashPaymentMethod: "", // Additional field for "Collect Payment"
    referredPaymentMethod: "", // Additional field for "Referred Payment"
    paymentVerificationStatus: "",
  });

    useEffect(() => {
      if (paymentData) {        
        setPaymentDetails({
          paymentPlan: paymentData?.paymentPlan || "",
          note: paymentData?.note || "",
          totalPaymentDue: paymentData?.totalPaymentDue || "",
          totalPaymentToDate: paymentData?.totalPaymentToDate || "",
          paymentMethod: paymentData?.paymentMethod || "",
          paymentAmount: paymentData?.modulePrice || "",
          paymentStatus: paymentData?.paymentStatus || "NP",
          paidAmount: paymentData?.paidAmount || "",
          otherPaymentMethod: paymentData?.otherPaymentMethod || "",
          bankPaymentMethod: paymentData?.bankPaymentMethod || "",
          cashPaymentMethod: paymentData?.cashPaymentMethod || "",
          referredPaymentMethod: paymentData?.referredPaymentMethod || "",
          paymentLog: paymentData?.paymentLog || [],
          paymentVerificationStatus:
            paymentData?.paymentVerificationStatus || "awaiting approval",
        });
        setreferenceIdToPass(paymentData?.moduleAssignmentID); 
      }
    }, [paymentData]);

    // useEffect(() => {
    //   if (moduleAssignmentData) {
    //     setreferenceIdToPass(moduleAssignmentData._id);        
    //   }
    // }, [moduleAssignmentData]);

  const handleChange = (field, value) => {
    setPaymentDetails({ ...paymentDetails, [field]: value });
    // if (field === "paidAmount") {      
    //   setPaymentDetails({
    //     ...paymentDetails,
    //     totalPaymentDue: (
    //       Number(paymentDetails.paymentAmount) - Number(value)
    //     ).toString(),
    //     [field]: value,
    //   });
    // } else if ( field === "paymentAmount"){
    //   setPaymentDetails({
    //     ...paymentDetails,
    //     totalPaymentDue: (
    //       Number(value) - Number(paymentDetails.paidAmount)
    //     ).toString(),
    //     [field]: value,
    //   });
    // }
  };

  const handleSubmit = async () => {
    setformLoading(true);
    try{
      const response = await updatePayment(paymentDetails, paymentRequiredInformation);
      setPaymentDetails({...paymentDetails, paymentLog : response.paymentLog, paymentVerificationStatus : "awaiting approval"})
      console.log("Form Data:", paymentDetails);
      console.log("Response Data:", response);
      setFormSaved(true);
      setformLoading(false);
    }catch (e) {
        setFormError(true);
        setformLoading(false)
        setFormErrorMessage(e.message)
        console.log("Error submitting form: ", e.message)
    }
  };

  const handleSnackbarClose = () => {
    setFormSaved(false);
  };

  const handleSnackbarCloseError = () => {
    setFormError(false);
  };

  if (loading) {    
      return (
          <Box mt="200px" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={150} sx={{ color: colors.blueAccent[100] }} />
          </Box>
      );
  }

  if (error) {
      return <div>{error.message}</div>;
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          width: "800px",
          backgroundColor: colors.grey[900],
          padding: 3,
          borderRadius: 3,
          mx: "auto",
          mt: "50vh",
          transform: "translateY(-50%)",
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: colors.grey[50],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box display="flex" py={2}>
          <Box flexGrow={3}>
            <Typography variant="h5" color={colors.grey[50]} sx={{ mb: 2 }}>
              Add Payment Details Form
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="payment-status-label">
                    Payment Plan
                  </InputLabel>
                  <Select
                    labelId="payment-plan-label"
                    id="payment-plan"
                    label="Payment plan"
                    value={paymentDetails.paymentPlan}
                    onChange={(e) =>
                      handleChange("paymentPlan", e.target.value)
                    }
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="year">Whole year plan</MenuItem>
                    <MenuItem value="installment">
                      Whole year - 2 instalment plan
                    </MenuItem>
                    <MenuItem value="individual">Individual plan</MenuItem>
                    {/* <MenuItem value="FILE UPLOADED">FILE UPLOADED</MenuItem>
                  <MenuItem value="IN REVIEW">IN REVIEW</MenuItem>
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem> */}
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
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Payment Amount"
                  fullWidth
                  value={paymentDetails.paymentAmount}
                  onChange={(e) =>
                    handleChange("paymentAmount", e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Paid Amount"
                  fullWidth
                  value={paymentDetails.paidAmount}
                  onChange={(e) => handleChange("paidAmount", e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Total Payment Due"
                  fullWidth
                  value={paymentDetails.totalPaymentDue}
                  onChange={(e) =>
                    handleChange("totalPaymentDue", e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="payment-status-label">
                    Payment Status
                  </InputLabel>
                  <Select
                    labelId="payment-status-label"
                    id="payment-status"
                    label="Payment Status"
                    value={paymentDetails.paymentStatus}
                    onChange={(e) =>
                      handleChange("paymentStatus", e.target.value)
                    }
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="NP">NOT PAID</MenuItem>
                    <MenuItem value="PP">PARTIALLY PAID</MenuItem>
                    <MenuItem value="PAID">PAID</MenuItem>
                    {/* <MenuItem value="FILE UPLOADED">FILE UPLOADED</MenuItem>
                  <MenuItem value="IN REVIEW">IN REVIEW</MenuItem>
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    sx={{ width: "100%", mb: 2 }}
                    label="Total Payment to Date"
                    inputFormat="MM/dd/yyyy" // Custom date format
                    value={
                      paymentDetails.totalPaymentToDate
                        ? new Date(paymentDetails.totalPaymentToDate)
                        : null
                    } // Ensure the value is a Date object
                    onChange={(newValue) =>
                      handleChange(
                        "totalPaymentToDate",
                        newValue ? format(newValue, "MM/dd/yyyy") : null
                      )
                    }
                    slots={{
                      textField: (params) => (
                        <TextField {...params} fullWidth variant="outlined" />
                      ),
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6} display="flex" alignItems="center">
                <Chip
                  label={
                    enumToString('paymentVerificationStatus', paymentDetails.paymentVerificationStatus)
                  }
                  sx={{
                    width: "100%",
                    borderRadius: 1,
                    mb: 2,
                    backgroundColor:
                      paymentDetails.paymentVerificationStatus ===
                        "awaiting approval" ||
                      paymentDetails.paymentVerificationStatus === "rejected"
                        ? "#db4f4a" // Red for awaiting approval
                        : paymentDetails.paymentVerificationStatus ===
                          "approved"
                        ? "#4cceac" // Green for approved
                        : "#858585", // Default grey
                    color:
                      paymentDetails.paymentVerificationStatus ===
                      "awaiting approval"
                        ? "#fff"
                        : paymentDetails.paymentVerificationStatus ===
                          "approved"
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
                  <InputLabel id="payment-method-label">
                    Payment Method
                  </InputLabel>
                  <Select
                    labelId="payment-method-label"
                    label="Payment Method"
                    value={paymentDetails.paymentMethod}
                    onChange={(e) =>
                      handleChange("paymentMethod", e.target.value)
                    }
                    fullWidth
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
                  />
                )}
              </Grid>
            </Grid>
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
            {paymentDetails.paymentLog &&
            paymentDetails.paymentLog.length > 0 ? (
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

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={formLoading}
          sx={{
            width: "100%",
            backgroundColor: colors.blueAccent[500],
            "&:hover": {
              backgroundColor: colors.blueAccent[600],
            },
          }}
        >
          {formLoading ? (
            <CircularProgress size={24} sx={{ color: colors.grey[900] }} />
          ) : (
            "Update Payment"
          )}
        </Button>

        <Snackbar
          open={formSaved}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity="success"
          >
            Payment updated successfully!
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={formError}
          autoHideDuration={6000}
          onClose={handleSnackbarCloseError}
        >
          <Alert
            onClose={handleSnackbarCloseError}
            severity="error"
            sx={{ width: "100%" }}
          >
            Failed updating payment details. {formErrorMessage}. Please try
            again.
          </Alert>
        </Snackbar>
        {fileUploadModalOpen && (
          <FileUpload
            setOpen={setOpen}
            open={open}
            referenceID={referenceIdToPass}
            referenceCollection={"ModuleAssignment"}
            isPayment={true}
          />
        )}
      </Box>
    </Modal>
  );
};

export default PaymentForm