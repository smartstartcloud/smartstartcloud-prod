import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // For accessing query params
import { Button, Container, Typography, Box, Card, CardContent, IconButton, TableContainer, Table, TableHead, TableCell, TableRow, TableBody, Grid, TextField, useTheme, Modal } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DoneIcon from '@mui/icons-material/Done';
import { Controller, useForm } from 'react-hook-form';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import useUploadFiles from '../hooks/useUploadFiles';
import useFetchFileList from '../hooks/useFetchFileList';

const FileUpload = ({orderID: orderIDFromParent, setOpen, open }) => {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [token, setToken] = useState(null);
  const [orderID, setOrderID] = useState(orderIDFromParent);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { uploadFiles, downloadFiles } = useUploadFiles();
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
    const tokenFromURL = params.get("token");
    setToken(tokenFromURL);
  }, [location]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles([...selectedFiles]);
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
    event.stopPropagation();
  };

  // Function to trigger file input click
  const handleClick = () => {
    document.querySelector('input[type="file"]').click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0]; // Get the dropped file
    if (file) {
      console.log("Dropped file:", file);
      // Call handleFileChange manually
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("orderID", orderID);
    try {
      const response = await uploadFiles(formData);
      console.log("Response Data:", response);
      setUploadSuccess(true);
    } catch (error) {
      console.log("Error submitting form: ", error.message);
    }
  };

  const handleDownload = async (file) => {
    downloadFiles(file, true);
  };

  const handleView = async (file) => {
    downloadFiles(file, false);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Container maxWidth="md" style={{ marginTop: "50px" }}>
        <Card raised style={{ padding: "20px", borderRadius: "10px" }}>
          <CardContent>
            {/* <Typography
              variant="h4"
              gutterBottom
              align="center"
              style={{ fontWeight: "bold", color: "#1976d2" }}
            >
              File Upload
            </Typography> */}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="orderID"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={orderID || ""}
                      label="Order ID"
                      variant="outlined"
                      fullWidth
                      required
                      disabled
                    />
                  )}
                />
              </Grid>
              {/* <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    component="label"
                    color="secondary"
                    startIcon={<CloudUploadIcon />}
                    style={{
                      width: "100%",
                      padding: "10px 20px",
                      marginBottom: "20px",
                      marginRight: "10px",
                    }}
                  >
                    Upload Attachments
                    <input type="file" onChange={handleFileChange} hidden />
                  </Button>
                </Grid> */}
              <Grid item sm={12}>
                <Box>
                  <input type="file" onChange={handleFileChange} hidden />
                  <Box
                    onClick={handleClick} // Trigger file input on click
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    sx={{
                      border: "2px dashed #cccccc",
                      borderRadius: "5px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      marginTop: "10px",
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p>Drag and drop a file here or click to upload</p>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {files.length > 0 && (
              <TableContainer
                component={Paper}
                style={{ marginTop: "20px", marginBottom: "20px" }}
              >
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
                          <IconButton
                            color="secondary"
                            onClick={() => handleDownload(file)}
                          >
                            <CloudDownloadIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell align="center">
                          {!uploadSuccess ? (
                            <IconButton
                              color="primary"
                              onClick={() => handleUpload(file)}
                            >
                              <CloudUploadIcon />
                            </IconButton>
                          ) : (
                            <IconButton color="primary">
                              <DoneIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {existingFiles.length > 0 && (
              <Box mt={3}>
                <Typography
                  variant="h5"
                  gutterBottom
                  align="center"
                  style={{ color: "#1976d2" }}
                >
                  Current Files
                </Typography>
                <TableContainer component={Paper} style={{ marginTop: "20px" }}>
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
                          <TableCell align="center">
                            <Typography
                              align="center"
                              onClick={() => handleView(file)}
                              sx={{ cursor: "pointer" }}
                            >
                              {file.fileName}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="secondary"
                              onClick={() => handleDownload(file)}
                            >
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
    </Modal>
  );
}

export default FileUpload;
