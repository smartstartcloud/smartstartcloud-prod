import { Box, Button, TextField, IconButton, InputAdornment } from '@mui/material'
import Header from '../../components/Header'
import React, { useState } from 'react'
import { Formik } from 'formik'
import * as yup from "yup"
import useMediaQuery from '@mui/material/useMediaQuery'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'


const userSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required('Password is required'),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
})

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    password: "",
    passwordConfirmation: "",
}

const Login = ({auth}) => {
    
    const isNonMobile = useMediaQuery('(min-width: 600px)')

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleFormSubmit = (values) => {
        auth(values);
    }

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

  return (
    <Box m="20px">
        <Header title={"Login User"} subtitle={"This is the Login Page"} />
        
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={userSchema}
        >
            {
                ({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Box 
                            display="grid" 
                            gap="30px" 
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
                            }}
                        >
                            <TextField 
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name="email"
                                error={!!touched.email && !!errors.email}
                                helperText={!!touched.email && !!errors.email}
                                sx={{gridColumn: "span 4"}}
                            />
                            <TextField 
                                fullWidth
                                variant="filled"
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name="password"
                                error={!!touched.password && !!errors.password}
                                helperText={!!touched.password && !!errors.password}
                                sx={{gridColumn: "span 4"}}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField 
                                fullWidth
                                variant="filled"
                                type={showConfirmPassword ? 'text' : 'password'}
                                label="Confirm Password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.passwordConfirmation}
                                name="passwordConfirmation"
                                error={!!touched.passwordConfirmation && !!errors.passwordConfirmation}
                                helperText={!!touched.passwordConfirmation && !!errors.passwordConfirmation}
                                sx={{gridColumn: "span 4"}}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleToggleConfirmPasswordVisibility} edge="end">
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                Create New User
                            </Button>
                        </Box>
                    </form>
                )
            }

        </Formik>
    </Box>
  )
}

export default Login