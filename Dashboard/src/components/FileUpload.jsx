import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // For accessing query params
import { Button, Container, Typography, Box, Card, CardContent, IconButton, TableContainer, Table, TableHead, TableCell, TableRow, TableBody, Grid, TextField, useTheme } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DoneIcon from '@mui/icons-material/Done';
import { Controller, useForm } from 'react-hook-form';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import useUploadFiles from '../hooks/useUploadFiles';
import useFetchFileList from '../hooks/useFetchFileList';

const FileUpload = ({ orderID: orderIDFromParent, setOpen }) => {
    const theme = useTheme();
    const [files, setFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [token, setToken] = useState(null);
    const [orderID, setOrderID] = useState(orderIDFromParent);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const { uploadFiles } = useUploadFiles();
    const { fileList } = useFetchFileList(orderID);

    const { control, setError, clearErrors, touchedFields, errors } = useForm({});

    // Use useEffect to set existingFiles when fileList changes
    useEffect(() => {
        if (fileList) {
            setExistingFiles(fileList);
        }
    }, [fileList]);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromURL = params.get('token');
        setToken(tokenFromURL);
    }, [location]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    };

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('orderID', orderID);
        try {
            const response = await uploadFiles(formData);
            console.log('Response Data:', response);
            setUploadSuccess(true);
        } catch (error) {
            console.log("Error submitting form: ", error.message);
        }
    };

    const handleDownload = async (file) => {
        try {
            const response = await axios.get(`http://localhost:5000/files/download/${file.orderID}`, {
                responseType: 'blob', // Important to get the file as a blob
            });
            
            // Create a blob link for the file and trigger the download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.setAttribute('download', file.fileName); // Set the file name for download
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '50px' }}>
            <Card raised style={{ padding: '20px', borderRadius: '10px' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                        File Upload
                    </Typography>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Button
                                variant="contained"
                                component="label"
                                color="secondary"
                                startIcon={<CloudUploadIcon />}
                                style={{ width: '100%', padding: '10px 20px', marginBottom: '20px', marginRight: '10px' }}
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
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        value={orderID}
                                        label="Order ID"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        disabled
                                        error={!!touchedFields.orderID && !!errors.orderID}
                                        helperText={touchedFields.orderID && errors.orderID ? errors.orderID.message : null}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            if (!field.value) {
                                                setError("orderID", { type: "manual", message: "Order ID is required" });
                                            } else {
                                                clearErrors("orderID");
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

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

export default FileUpload;
