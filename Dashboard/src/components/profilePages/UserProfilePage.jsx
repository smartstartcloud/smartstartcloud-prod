import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  Typography,
  Box,
  Snackbar,
  CircularProgress,
  Alert,
  Grid,
  Select,
  MenuItem,
  useTheme,
  IconButton,
  InputAdornment,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { tokens } from "../../theme";
import useSignup from "../../hooks/useSignup";
import { useLocation } from "react-router-dom";
import useFetchUserInfo from "../../hooks/UseFetchUserInfo";
import useLogout from "../../hooks/useLogout";

const UserProfilePage = () => {
  const location = useLocation();
  const userID = location.state?.uID; // Access the passed state
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [formSuccess, setformSuccess] = useState(false);
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // const [isEdit, setIsEdit] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const  {logout} = useLogout()

  const { user } = useFetchUserInfo(userID);

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      oldPassword: "",
      password: "",
      passwordConfirmation: "",
      gender: "male",
      role: "agent",
    },
  });

  const password = watch("password");
  const passwordConfirmation = watch("passwordConfirmation");
  const oldPassword = watch("oldPassword");
  // useEffect to pre-fill form data
  useEffect(() => {
    if (user) {      
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        userName: user.userName || "",
        email: user.email || "",
        gender: user.gender || "male",
        role: user.role || "agent",
        oldPassword: "",
        password: "", // Leave blank by default
        passwordConfirmation: "",
      });
    }
  }, [user, reset]);

  const { updateUser } = useSignup();

  const handleToggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleClose = () => {
    setformSuccess(false);
  };

  const handleCloseError = () => {
    setFormError(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);    
    try {
      const payload = {
        ...data,
        userID, // passed from location.state
      };
      const response = await updateUser(payload);
      console.log("Updated:", response);
      setformSuccess(true);
      logout();
    } catch (e) {
      setFormError(true);
      console.log(e);
      
      setErrorMessage(`${e.message}. ${e.response.data.error}` || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      sx={{
        p: 3,
        width: "80%",
        maxWidth: "80%",
        margin: "0 auto",
        mt: 5,
        border: "1px solid rgba(102, 106, 108, 0.5)",
        borderRadius: "8px",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: colors.grey[300],
          },
          "&.Mui-focused fieldset": {
            borderColor: colors.grey[100],
          },
        },
        "& .MuiInputLabel-root": {
          color: colors.grey[300],
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: colors.grey[100],
        },
      }}
    >
      <Typography variant="h4" gutterBottom mb={5}>
        Edit Profile Form
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            p: 3,
            pt: 1,
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto",
            mt: 3,
            border: "1px solid rgba(102, 106, 108, 0.5)",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mt: 1, mb: 2 }}>
            Personal information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    error={!!touchedFields.firstName && !!errors.firstName}
                    helperText={
                      touchedFields.firstName && errors.firstName
                        ? errors.firstName.message
                        : null
                    }
                    onBlur={(e) => {
                      field.onBlur();
                      if (!field.value) {
                        setError("firstName", {
                          type: "manual",
                          message: "First Name is required",
                        });
                      } else {
                        clearErrors("firstName");
                      }
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    error={!!touchedFields.lastName && !!errors.lastName}
                    helperText={
                      touchedFields.lastName && errors.lastName
                        ? errors.lastName.message
                        : null
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Username"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    disabled
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: "Email is not valid",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                    disabled
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    variant="outlined"
                    fullWidth
                    displayEmpty
                    required
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="" disabled>
                      Select Gender
                    </MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            p: 3,
            pt: 1,
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto",
            mt: 3,
            border: "1px solid rgba(102, 106, 108, 0.5)",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mt: 1, mb: 2 }}>
            Security
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Controller
                name="oldPassword"
                control={control}
                rules={{
                  validate: (value) => {
                    if (password || passwordConfirmation) {
                      return value ? true : "Old password is required";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Old Password"
                    variant="outlined"
                    type={showOldPassword ? "text" : "password"}
                    fullWidth
                    sx={{ mb: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleToggleOldPasswordVisibility}
                            edge="end"
                          >
                            {showOldPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.oldPassword}
                    helperText={
                      errors.oldPassword ? errors.oldPassword.message : null
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Controller
                name="password"
                control={control}
                rules={{
                  validate: (value) => {
                    if (oldPassword || passwordConfirmation) {
                      if (!value) return "New Password is required";
                      if (value === oldPassword)
                        return "Passwords can not match the previous password";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="New Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    fullWidth
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
                    error={!!errors.password}
                    helperText={
                      errors.password ? errors.password.message : null
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="passwordConfirmation"
                control={control}
                rules={{
                  validate: (value) => {
                    if (oldPassword || password) {
                      if (!value) return "Password confirmation is required";
                      if (value !== getValues("password"))
                        return "Passwords do not match";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password Confirmation"
                    variant="outlined"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    sx={{ mb: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleToggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.passwordConfirmation}
                    helperText={
                      errors.passwordConfirmation
                        ? errors.passwordConfirmation.message
                        : null
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    variant="outlined"
                    fullWidth
                    disabled
                    displayEmpty
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="" disabled>
                      Select Role
                    </MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="finance">Finance</MenuItem>
                    <MenuItem value="agent">Agent</MenuItem>
                    <MenuItem value="edu">EDU</MenuItem>
                    <MenuItem value="pen">PEN</MenuItem>
                  </Select>
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              width: "200px",
              backgroundColor: colors.grey[200],
              color: colors.grey[900],
              "&:hover": { backgroundColor: colors.grey[100] },
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: colors.grey[900] }} />
            ) : (
              "Update"
            )}
          </Button>
          {/* <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Button color="secondary" variant="text">
                            LOGIN
                        </Button>
                    </Link> */}
        </Box>
      </form>
      <Snackbar
        open={formSuccess}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity="success"
        >
          User Signup Complete!
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={formError}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          User Signup failed. {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfilePage;
