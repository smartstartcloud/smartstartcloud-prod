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
  Tabs,
  Tab,
} from "@mui/material";
import { tokens } from '../../theme';
import useGetPaymentDetails from '../../hooks/useGetPaymentDetails';
import useSendPaymentData from '../../hooks/useSendPaymentData';
import { enumToString, formatDate } from '../../utils/functions';
import FileUpload from '../FileUpload';
import PaymentFormSingle from './PaymentFormSingle';

const PaymentForm = ({ open, setOpen, paymentRequiredInformation }) => {     
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);    
  
  const [formSaved, setFormSaved] = useState(false);
  const [formError, setFormError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [formLoading, setformLoading] = useState(false);
  const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false);

  const [referenceIdToPass, setreferenceIdToPass] = useState("");
  const [tabValue, setTabValue] = useState("new");
  
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
    bankPayeeName: "",
    cashPaymentMethod: "", // Additional field for "Collect Payment"
    referredPaymentMethod: "", // Additional field for "Referred Payment"
    paymentVerificationStatus: "",
  });

    useEffect(() => {
      if (paymentData) {        
        setPaymentDetails({
          _id: paymentData[tabValue]?._id || null,
          paymentPlan: paymentData[tabValue]?.paymentPlan || "",
          note: paymentData[tabValue]?.note || "",
          totalPaymentDue: paymentData[tabValue]?.totalPaymentDue || "",
          totalPaymentToDate: paymentData[tabValue]?.totalPaymentToDate || "",
          paymentMethod: paymentData[tabValue]?.paymentMethod || "",
          paymentAmount: paymentData[tabValue]?.modulePrice || "",
          paymentStatus: paymentData[tabValue]?.paymentStatus || "NP",
          paidAmount: paymentData[tabValue]?.paidAmount || "",
          otherPaymentMethod: paymentData[tabValue]?.otherPaymentMethod || "",
          bankPaymentMethod: paymentData[tabValue]?.bankPaymentMethod || "",
          bankPayeeName: paymentData[tabValue]?.bankPayeeName || "",
          cashPaymentMethod: paymentData[tabValue]?.cashPaymentMethod || "",
          referredPaymentMethod: paymentData[tabValue]?.referredPaymentMethod || "",
          paymentLog: paymentData[tabValue]?.paymentLog || [],
          paymentVerificationStatus:
            paymentData[tabValue]?.paymentVerificationStatus || "",
        });
        setreferenceIdToPass(paymentData[tabValue]?.moduleAssignmentID);
      }
    }, [paymentData, tabValue]);

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

  const handleTabChange = (event, newValue) => {    
    setTabValue(newValue);
  };

  const handleSubmit = async (isNew) => {    
    setformLoading(true);
    try{
      const response = await updatePayment(
        paymentDetails,
        paymentRequiredInformation,
        isNew
      );
      setPaymentDetails({...paymentDetails, paymentLog : response.paymentLog, paymentVerificationStatus : "awaiting approval"})
      console.log("Form Data:", paymentDetails);
      console.log("Response Data:", response);
      paymentData[tabValue] = response
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
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ width: "98%" }}
        >
          {paymentData &&
            paymentData.map((data, index) => (
              <Tab
                key={index}
                value={index}
                label={data.financeID || `Item ${index + 1}`}
              />
            ))}
          <Tab value="new" label="New Payment" />
        </Tabs>
        <PaymentFormSingle
          paymentDetails={paymentDetails}
          handleChange={handleChange}
          setFileUploadModalOpen={setFileUploadModalOpen}
        />
        <Grid container spacing={2} display="flex" justifyContent="center">
          {tabValue === "new" && (
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                onClick={() => handleSubmit(true)}
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
                  <CircularProgress
                    size={24}
                    sx={{ color: colors.grey[900] }}
                  />
                ) : (
                  "Add New Payment"
                )}
              </Button>
            </Grid>
          )}
          {tabValue !== "new" && (
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                onClick={() => handleSubmit(false)}
                disabled={formLoading}
                sx={{
                  width: "100%",
                  borderColor: colors.primary?.[500] || "#defaultBorderColor",
                  borderWidth: "1px", // Ensure a border width
                  borderStyle: "solid", // Ensure the border is solid
                  backgroundColor:
                    colors.blueAccent?.[900] || "#defaultBackground",
                  color: colors.primary?.[100] || "#defaultTextColor",
                  "&:hover": {
                    borderColor:
                      colors.blueAccent?.[800] || "#defaultHoverBorder",
                    backgroundColor:
                      colors.blueAccent?.[700] || "#defaultHoverBackground",
                  },
                }}
              >
                {formLoading ? (
                  <CircularProgress
                    size={24}
                    sx={{ color: colors.grey[900] }}
                  />
                ) : (
                  "Update Payment"
                )}
              </Button>
            </Grid>
          )}
        </Grid>
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