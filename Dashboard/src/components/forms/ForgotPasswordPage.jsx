import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import useApi from "../../hooks/useApi"; // 🔁 your custom hook

const ForgotPasswordPage = () => {
  const api = useApi();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    error: false,
  });

  const onSubmit = async (data) => {    
    setLoading(true);
    const {email} = data
    try {
      const res = await api.post("/api/auth/forgot-password", {
        email,
        frontendURL: window.location.origin, // 👈 smartstart.com or portal.smartstart.com
      });
      setSnackbar({ open: true, message: res.data.message, error: false });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.error || "Something went wrong",
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 400, mx: "auto", mt: 6 }}>
      <Typography variant="h5" mb={2}>
        Forgot Password
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
              message: "Invalid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
        </Button>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.error ? "error" : "success"}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPasswordPage;
