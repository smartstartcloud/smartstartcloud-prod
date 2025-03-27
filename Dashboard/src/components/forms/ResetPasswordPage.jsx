import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useApi from "../../hooks/useApi";

const ResetPasswordPage = () => {
    const { token } = useParams();

    const api = useApi();
    const navigate = useNavigate();

    const {
      control,
      handleSubmit,
      getValues,
      setError,
      clearErrors,
      formState: { errors, touchedFields },
    } = useForm({
      defaultValues: {
        password: "",
        passwordConfirmation: "",
      },
    });

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        error: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (data) => {        
        setLoading(true);
        try {
        const res = await api.post(`/api/auth/reset-password/${token}`, {
            newPassword: data.password,
        });
        setSnackbar({ open: true, message: res.data.message, error: false });

        setTimeout(() => navigate("/login"), 2500); // Redirect after success
        } catch (err) {
            setSnackbar({
                open: true,
                message: err?.response?.data?.error || "Reset failed",
                error: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
      <Box sx={{ width: "100%", maxWidth: 400, mx: "auto", mt: 6 }}>
        <Typography variant="h5" mb={2}>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!touchedFields.password && !!errors.password}
                    helperText={
                      touchedFields.password && errors.password
                        ? errors.password.message
                        : null
                    }
                    onBlur={(e) => {
                      field.onBlur();
                      if (!field.value) {
                        setError("password", {
                          type: "manual",
                          message: "Password is required",
                        });
                      } else {
                        clearErrors("password");
                      }
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="passwordConfirmation"
                control={control}
                rules={{
                  required: "Password confirmation is required",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password Confirmation"
                    variant="outlined"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleToggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={
                      !!touchedFields.passwordConfirmation &&
                      !!errors.passwordConfirmation
                    }
                    helperText={
                      touchedFields.passwordConfirmation &&
                      errors.passwordConfirmation
                        ? errors.passwordConfirmation.message
                        : null
                    }
                    onBlur={(e) => {
                      field.onBlur();
                      if (!field.value) {
                        setError("passwordConfirmation", {
                          type: "manual",
                          message: "Password Confirmation is required",
                        });
                      } else {
                        clearErrors("passwordConfirmation");
                      }
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Reset Password"}
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

export default ResetPasswordPage;
