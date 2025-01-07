import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
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
} from "@mui/material";
import { tokens } from '../../theme';
import MuiAlert from '@mui/material/Alert';
import useSendStudentData from '../../hooks/useSendStudentData';

const PaymentForm = ({open, setOpen}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // const { sendStudent, updateStudent } = useSendStudentData();
    // const navigate = useNavigate(); 
    // console.log(studentData.studentName, studentEditMode);

    const [paymentDetails, setPaymentDetails] = useState({
      totalPaymentDue: "",
      totalPaymentToDate: "",
      totalPaymentRemaining: "",
      paymentMethod: "",
      paymentAmount: "",
      paymentStatus: "",
      paymentDate: "",
      otherPaymentMethod: "", // Additional field for "Other"
    });

    const handleChange = (field, value) => {
      setPaymentDetails({ ...paymentDetails, [field]: value });
    };
    
    

    // const [formSaved, setFormSaved] = useState(false);
    // const [formError, setFormError] = useState(false);
    // const [formErrorMessage, setFormErrorMessage] = useState('');
    // const [formLoading, setformLoading] = useState(false);
    // const [errors, setErrors] = useState({});
    // const [newStudent, setNewStudent] = useState({
    //   studentID: studentData.studentID || "",
    //   studentName: studentData.studentName || "",
    //   studentLogin: studentData.studentLogin || "",
    //   studentPassword: studentData.studentPassword || "",
    //   studentContact: studentData.studentContact || "",
    //   degreeID: degreeID,
    // });

    // const validateForm = () => {
    //     const newErrors = {};
    //     if (!newStudent.studentID) newErrors.studentID = 'Student ID is required';
    //     if (!newStudent.studentName) newErrors.studentName = 'Student Name is required';
    //     return newErrors;
    // };

    // const handleSubmit = () => {        
    //     const validationErrors = validateForm();
    //     if (Object.keys(validationErrors).length === 0) {
    //         if(studentEditMode) {
    //             handleUpdateStudent();
    //         } else {
    //           handleAddStudent();
    //         }
    //         // navigate(0);
    //     } else {
    //         setErrors(validationErrors);
    //     }
    // };

    // const handleSnackbarClose = () => {
    //     setFormSaved(false);
    // };

    // const handleSnackbarCloseError = () => {
    //     setFormError(false);
    // };

    // const handleAddStudent = async () => {        
    //     setformLoading(true);
        
    //     try{
    //         const response = await sendStudent(newStudent)            
    //         console.log('Form Data:', newStudent);
    //         console.log('Response Data:', response);
    //         setFormSaved(true);
    //         setformLoading(false);
    //     }catch (e) {
    //         setFormError(true);
    //         setformLoading(false)
    //         setFormErrorMessage(e.message)
    //         console.log("Error submitting form: ", e.message)
    //         setOpen(false)
    //     }
    //     setNewStudent({
    //         studentID: '',
    //         studentName: '',
    //         studentLogin: '',
    //         studentPassword: '',
    //         studentContact: ''
    //     });
    // };

    return (
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: "400px",
            backgroundColor: colors.grey[900],
            padding: 3,
            borderRadius: 3,
            mx: "auto",
            mt: "10%",
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
          <Typography variant="h5" color={colors.grey[50]} sx={{ mb: 2 }}>
            Add Payment Details
          </Typography>
          <TextField
            label="Total Payment Due"
            fullWidth
            value={paymentDetails.totalPaymentDue}
            onChange={(e) => handleChange("totalPaymentDue", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Payment Amount"
            fullWidth
            value={paymentDetails.paymentAmount}
            onChange={(e) => handleChange("paymentAmount", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Payment Status"
            fullWidth
            value={paymentDetails.paymentStatus}
            onChange={(e) => handleChange("paymentStatus", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="PaymentDate"
            fullWidth
            value={paymentDetails.paymentDate}
            onChange={(e) => handleChange("paymentDate", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Total Payment to Date"
            fullWidth
            value={paymentDetails.totalPaymentToDate}
            onChange={(e) => handleChange("totalPaymentToDate", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Total Payment Remaining"
            fullWidth
            value={paymentDetails.totalPaymentRemaining}
            onChange={(e) =>
              handleChange("totalPaymentRemaining", e.target.value)
            }
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              value={paymentDetails.paymentMethod}
              onChange={(e) => handleChange("paymentMethod", e.target.value)}
              fullWidth
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="bank">Bank</MenuItem>
              <MenuItem value="referral">Referral</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
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
          {/* {studentEditMode ? (
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
                "Update Student"
              )}
            </Button>
          ) : (
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
                "Add Student"
              )}
            </Button>
          )} */}

          {/* <Snackbar
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
              Student added successfully!
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
              Failed adding student. {formErrorMessage}. Please try again.
            </Alert>
          </Snackbar> */}
        </Box>
      </Modal>
    );
}

export default PaymentForm