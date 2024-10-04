import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // For accessing query params
import { Button, Container, Typography, Box, Card, CardContent, IconButton, TableContainer, Table, TableHead, TableCell, TableRow, TableBody, Grid, TextField, useTheme, ListItem, List, ListItemText } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ShareIcon from '@mui/icons-material/Share';
import axios from 'axios';
import useUploadFiles from '../hooks/useUploadFiles';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Paper from '@mui/material/Paper';
import DoneIcon from '@mui/icons-material/Done';
import { Controller, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '../theme';
import useFetchFileList from '../hooks/useFetchFileList';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';

const FileUpload = ({orderID : orderIDFromParent, setOpen}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [files, setFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [token, setToken] = useState(null);
    const [orderID, setOrderID] = useState(orderIDFromParent);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [shareableLink, setShareableLink] = useState('');
    const { uploadFiles } = useUploadFiles();
    const {fileList, loading, error} = useFetchFileList(orderID)

    // Use useEffect to set existingFiles when fileList changes
    useEffect(() => {
        if (fileList) {
            setExistingFiles(fileList);
        }
    }, [fileList]);
    

    // Get token from the URL
    const location = useLocation();

    const { control, setError, clearErrors, reset, formState: { errors, touchedFields } } = useForm({});    
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromURL = params.get('token');
        setToken(tokenFromURL);
    }, [location]);

    // Handle multiple file changes
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    };

    const handleUpload = async (file) => {
        // Prepare form data for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('orderID', orderID); // BSON handling occurs in the backend
        try {
            const response = await uploadFiles(formData)
            console.log('Response Data:', response);
            setUploadSuccess(true);
        } catch (error) {
            console.log("Error submitting form: ", error.message)
        }
    };

    const handleDownload = (file) => {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    }
    return (
        <Container maxWidth="md" style={{ marginTop: '50px'}}>
            <Card raised style={{ padding: '20px', borderRadius: '10px' }}>
                {/* <IconButton
                    onClick={() => setOpen(false)}
                    sx={{ position: 'relative', top: 10, right: 10, color: colors.grey[50] }}
                >
                    <CloseIcon />
                </IconButton> */}
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                        File Upload
                    </Typography>
                    
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={4}>
                            <Button
                                variant="contained"
                                component="label"
                                color="secondary"
                                startIcon={<CloudUploadIcon />}
                                style={{width: '100%' ,padding: '10px 20px', marginBottom: '20px', marginRight: '10px' }}
                            >
                                Upload Attachments
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    hidden
                                    multiple
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name='orderID'
                                control={control}
                                render={({field})=>(
                                    <TextField
                                        {...field}
                                        value={orderID}
                                        label="Order ID"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        disabled
                                        sx={{ mb: 2 }}
                                        error={!!touchedFields.orderID && !!errors.orderID}
                                        helperText={touchedFields.orderID && errors.orderID ? errors.orderID.message : null}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            if (!field.value) {
                                                setError("orderID", { type: "manual", message: "Order ID is required" });
                                            }else {
                                                clearErrors("orderID");
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            {/* Show "Share this page" button only if there is no token */}
                            {/* {!token && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<ShareIcon />}
                                    // onClick={handleGenerateShareableLink}
                                    style={{ padding: '10px 20px' }}
                                >
                                    Share This Page
                                </Button>
                            )} */}

                            {/* Display the generated shareable link */}
                            {/* {shareableLink && (
                                <Typography variant="body1" style={{ marginTop: '10px' }}>
                                    Shareable Link: <a href={shareableLink}>{shareableLink}</a>
                                </Typography>
                            )} */}
                        </Grid>
                    </Grid>
                    {/* Render table if files are uploaded */}
                    {files.length > 0 && (
                        <TableContainer component={Paper} style={{ marginTop: '20px', marginBottom: '20px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">File Name</TableCell>
                                        <TableCell align="center">Download</TableCell>
                                        <TableCell align="center">Upload</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {files.map((file, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{file.name}</TableCell>
                                            <TableCell align="center">
                                                <IconButton color="secondary" onClick={() => handleDownload(file)}>
                                                    <CloudDownloadIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="center">
                                                {!uploadSuccess ? <IconButton color="primary" onClick={() => handleUpload(file)}>
                                                    <CloudUploadIcon />
                                                </IconButton> :
                                                <IconButton color="primary">
                                                    <DoneIcon />
                                                </IconButton>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    <List>
                        <Divider component="li" />
                    </List>
                    {/* Render table if files are present */}
                    {existingFiles.length > 0 && (
                        <Box mt={3}>
                            <Typography variant="h5" gutterBottom align="center" style={{ color: '#1976d2' }}>
                                Current Files
                            </Typography>
                            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">File Name</TableCell>
                                            <TableCell align="center">Download</TableCell>
                                            <TableCell align="center">Delete</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {existingFiles.map((file, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="center">{file.fileName}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton color="secondary" onClick={() => handleDownload(file)}>
                                                        <CloudDownloadIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {!uploadSuccess ? <IconButton color={colors.redAccent[500]} onClick={() => handleUpload(file)}>
                                                        <DeleteIcon />
                                                    </IconButton> :
                                                    <IconButton color="primary">
                                                        <DoneIcon />
                                                    </IconButton>}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                        
                    )}
                </CardContent>
            </Card>
        </Container>
    )
}

export default FileUpload