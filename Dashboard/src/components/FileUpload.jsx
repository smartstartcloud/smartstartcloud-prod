import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Typography, Box, Card, CardContent, IconButton, TableContainer,
  Table, TableHead, TableCell, TableRow, TableBody, Grid, TextField, useTheme, Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import Paper from '@mui/material/Paper';
import useUploadFiles from '../hooks/useUploadFiles';
import useFetchFileList from '../hooks/useFetchFileList';
import { formatDate } from '../utils/functions';
import CircularProgressWithLabel from './CircularProgressWithLabel';

const customScrollbarStyles = {
  '&::-webkit-scrollbar': {
    display: 'none', 
  },
  '-ms-overflow-style': 'none', 
  'scrollbar-width': 'none', 
};

const FileUpload = ({
  referenceID,
  referenceCollection,
  setOpen,
  open,
  isOrder = false,
  orderID = '',
  isPayment = false,
  parentID = '',
  referenceDisplay='',
  isModule=false,
  viewOnly = false
}) => {  
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [existingFilteredFiles, setExistingFilteredFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [category, setCategory] = useState("");
  const [activeDisplayCategory, setActiveDisplayCategory] = useState("");
  const [uploadStatus, setUploadStatus] = useState({});
  const [uploadTimeline, setUploadTimeline] = useState([]);
  const { uploadFiles, downloadFiles, deleteFiles } = useUploadFiles();
  const { fileList } = useFetchFileList(referenceID, isOrder, orderID, parentID);
  const { studentId } = useParams();
  
  const { control } = useForm({});
  useEffect(() => {
    if (fileList) {
      setExistingFiles(fileList);
      setExistingFilteredFiles(fileList);
    }
  }, [fileList]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles([...selectedFiles]);
    setUploadStatus({});
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = () => {
    document.querySelector('input[type="file"]').click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    if(studentId) formData.append("studentID", studentId);
    formData.append("referenceID", referenceID);
    formData.append("fileCategory", category);
    formData.append("referenceCollection", referenceCollection);
    if (isPayment){
      formData.append("paymentFlag", true);
      formData.append("parentID", parentID);
    }
    if (isOrder){      
      formData.append("orderID", orderID);
      formData.append("referenceCollection", "Assignment");
      formData.append("fileCategory", "assignment");
      formData.append("writerFlag", true);
    }
    try {      
      const response = await uploadFiles(formData, setProgress);
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [file.name]: true,
      }));

      // Add to timeline
      setUploadTimeline((prevTimeline) => [
        ...prevTimeline,
        {
          fileName: file.name,
          fileType: file.type,
          uploadDateTime: new Date().toLocaleString(),
          uploadedBy: "UserName",
        },
      ]);

      setTimeout(() => {
        console.log(response);
        
        console.log("navigated ");
      }, 1);
      console.log("navigated ");
    } catch (error) {
      console.log("Error submitting form: ", error.message);
    }
  };

  const handleDownload = async (file) => {    
    downloadFiles(file, true, studentId);
  };

  const handleView = async (file) => {
    downloadFiles(file, false);
  };

  const handleDelete = async (file) => {
    try {
      const response = await deleteFiles(file._id, studentId);
      setExistingFilteredFiles((prevFiles) =>
        prevFiles.filter((prevFile) => prevFile._id !== file._id))
      console.log(response.message);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleCategoryChange = (category) => {
    const filteredFiles = existingFiles.filter(
      (file) => file.fileCategory === category
    );
    setExistingFilteredFiles(filteredFiles);
    setActiveDisplayCategory(category);
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Container maxWidth="md" sx={{ marginTop: "50px" }}>
        <Card
          raised
          sx={{
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            position: "relative",
            backgroundColor: theme.palette.background.paper,
            ...customScrollbarStyles,
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              color: theme.palette.grey[700],
              backgroundColor: theme.palette.background.default,
              borderRadius: "50%",
              padding: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>

          <CardContent>
            {!viewOnly && <>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="referenceID"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={referenceDisplay || ""}
                        label="Reference ID"
                        variant="outlined"
                        fullWidth
                        required
                        disabled
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* Select dropdown for order IDs */}
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                        <InputLabel>Select File Category</InputLabel>
                        <Select
                          {...field}
                          label="Select File Category"
                          variant="outlined"
                          value={category} // Set value from state
                          onChange={(e) => {
                            setCategory(e.target.value); // Update state when value changes
                            field.onChange(e); // Update react-hook-form value
                          }}
                          fullWidth
                        >
                          {!isModule &&
                            !isPayment && [
                              <MenuItem key="assignment" value="assignment">
                                Assignment
                              </MenuItem>,
                              <MenuItem key="payment" value="payment">
                                Payment
                              </MenuItem>,
                              <MenuItem key="grades" value="grades">
                                Grades
                              </MenuItem>,
                              <MenuItem
                                key="submissionEvidence"
                                value="submissionEvidence"
                              >
                                Submission Evidence
                              </MenuItem>,
                            ]}
                          {isPayment && (
                            <MenuItem key="payment" value="payment">
                              Payment
                            </MenuItem>
                          )}
                          {isModule && (
                            <MenuItem key="brief" value="brief">
                              Module Brief
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item sm={12}>
                  <Box>
                    <input type="file" onChange={handleFileChange} hidden />
                    <Box
                      onClick={handleClick}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      sx={{
                        border: "2px dashed #cccccc",
                        borderRadius: "10px",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                        marginTop: "10px",
                        height: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      <Typography>
                        Drag and drop a file here or click to upload
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {files.length > 0 && (
                <TableContainer
                  component={Paper}
                  sx={{
                    marginTop: "20px",
                    marginBottom: "20px",
                    ...customScrollbarStyles,
                  }}
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
                            {!uploadStatus[file.name] ? (
                              <IconButton
                                color="primary"
                                onClick={() => handleUpload(file)}
                              >
                                {Number(progress) > 0 &&
                                Number(progress) < 100 ? (
                                  <CircularProgressWithLabel
                                    value={Number(progress)}
                                  />
                                ) : (
                                  <CloudUploadIcon />
                                )}
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
            </>}

            <Grid container spacing={2} mt={3}>
              {!isModule && !isPayment && (
                <Grid item xs={3}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    align="center"
                    sx={{
                      color:
                        activeDisplayCategory === "assignment"
                          ? "#1976d2"
                          : "#000", // Change color if active
                      cursor: "pointer",
                      fontWeight:
                        activeDisplayCategory === "assignment"
                          ? "bold"
                          : "normal", // Add bold text if active
                      backgroundColor:
                        activeDisplayCategory === "assignment"
                          ? "#e3f2fd"
                          : "transparent", // Optional background highlight
                      padding:
                        activeDisplayCategory === "assignment" ? "5px" : "0", // Optional padding to indicate click
                    }}
                    onClick={() => handleCategoryChange("assignment")}
                  >
                    Assignment Files
                  </Typography>
                </Grid>
              )}
              {!isModule && (
                <Grid item xs={3}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    align="center"
                    sx={{
                      color:
                        activeDisplayCategory === "payment"
                          ? "#1976d2"
                          : "#000", // Change color if active
                      cursor: "pointer",
                      fontWeight:
                        activeDisplayCategory === "payment" ? "bold" : "normal", // Add bold text if active
                      backgroundColor:
                        activeDisplayCategory === "payment"
                          ? "#e3f2fd"
                          : "transparent", // Optional background highlight
                      padding:
                        activeDisplayCategory === "payment" ? "5px" : "0", // Optional padding to indicate click
                    }}
                    onClick={() => handleCategoryChange("payment")}
                  >
                    Payment Files
                  </Typography>
                </Grid>
              )}
              {!isModule && !isPayment && (
                <Grid item xs={3}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    align="center"
                    sx={{
                      color:
                        activeDisplayCategory === "grades" ? "#1976d2" : "#000", // Change color if active
                      cursor: "pointer",
                      fontWeight:
                        activeDisplayCategory === "grades" ? "bold" : "normal", // Add bold text if active
                      backgroundColor:
                        activeDisplayCategory === "grades"
                          ? "#e3f2fd"
                          : "transparent", // Optional background highlight
                      padding: activeDisplayCategory === "grades" ? "5px" : "0", // Optional padding to indicate click
                    }}
                    onClick={() => handleCategoryChange("grades")}
                  >
                    Grade Files
                  </Typography>
                </Grid>
              )}
              {!isModule && !isPayment && (
                <Grid item xs={3}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    align="center"
                    sx={{
                      color:
                        activeDisplayCategory === "submissionEvidence"
                          ? "#1976d2"
                          : "#000", // Change color if active
                      cursor: "pointer",
                      fontWeight:
                        activeDisplayCategory === "submissionEvidence"
                          ? "bold"
                          : "normal", // Add bold text if active
                      backgroundColor:
                        activeDisplayCategory === "submissionEvidence"
                          ? "#e3f2fd"
                          : "transparent", // Optional background highlight
                      padding:
                        activeDisplayCategory === "submissionEvidence"
                          ? "5px"
                          : "0", // Optional padding to indicate click
                    }}
                    onClick={() => handleCategoryChange("submissionEvidence")}
                  >
                    Submission Evidence Files
                  </Typography>
                </Grid>
              )}
              {isModule && (
                <Grid item xs={isModule ? 12 : 4}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    align="center"
                    sx={{
                      color:
                        activeDisplayCategory === "brief" ? "#1976d2" : "#000", // Change color if active
                      cursor: "pointer",
                      fontWeight:
                        activeDisplayCategory === "brief" ? "bold" : "normal", // Add bold text if active
                      backgroundColor:
                        activeDisplayCategory === "brief"
                          ? "#e3f2fd"
                          : "transparent", // Optional background highlight
                      padding: activeDisplayCategory === "brief" ? "5px" : "0", // Optional padding to indicate click
                    }}
                    onClick={() => handleCategoryChange("brief")}
                  >
                    Module Brief Files
                  </Typography>
                </Grid>
              )}
            </Grid>

            {(existingFilteredFiles.length > 0 ||
              uploadTimeline.length > 0) && (
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  File Management
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{ marginTop: "10px", ...customScrollbarStyles }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">File Name</TableCell>
                        <TableCell align="center">File Type</TableCell>
                        <TableCell align="center">Upload Date & Time</TableCell>
                        <TableCell align="center">Uploaded By</TableCell>
                        <TableCell align="center">Download</TableCell>
                        <TableCell align="center">Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {existingFilteredFiles.map((file, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">
                            <Typography
                              align="center"
                              onClick={() => handleView(file)}
                              sx={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              {file.fileName}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {file.fileType || "Unknown"}
                          </TableCell>
                          <TableCell align="center">
                            {formatDate(file.createdAt) || "N/A"}
                          </TableCell>
                          <TableCell align="center">
                            {file.uploadedByUserName || "Unknown"}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="secondary"
                              onClick={() => handleDownload(file)}
                            >
                              <CloudDownloadIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(file)}
                            >
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {uploadTimeline.map((entry, index) => (
                        <TableRow key={index + existingFilteredFiles.length}>
                          <TableCell align="center">{entry.fileName}</TableCell>
                          <TableCell align="center">{entry.fileType}</TableCell>
                          <TableCell align="center">
                            {entry.uploadDateTime}
                          </TableCell>
                          <TableCell align="center">
                            {entry.uploadedBy}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="secondary"
                              onClick={() => handleDownload(entry)}
                            >
                              <CloudDownloadIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(entry)}
                            >
                              <DeleteOutlineOutlinedIcon />
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
};

export default FileUpload;
