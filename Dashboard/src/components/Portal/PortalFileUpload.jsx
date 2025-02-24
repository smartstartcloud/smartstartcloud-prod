import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // For accessing query params
import {Button,Container,Typography,Box,Card,CardContent,IconButton,TableContainer,Table,TableHead,TableCell,TableRow,TableBody,Grid,TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ShareIcon from "@mui/icons-material/Share";
import axios from "axios";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Paper from "@mui/material/Paper";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useForm } from "react-hook-form";
import useUploadFiles from "../../hooks/useUploadFiles";
import CloseIcon from "@mui/icons-material/Close";
import useFetchFileList from "../../hooks/useFetchFileList";

const customScrollbarStyles = {
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  "scrollbar-width": "none",
};

const PortalFileUpload = ({orderIDPass, close, main=false, isModule=false}) => {
  const [files, setFiles] = useState([]);
  const [orderID, setOrderID] = useState(orderIDPass);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);
  const [existingFilteredFiles, setExistingFilteredFiles] = useState([]);
  const { uploadFiles, downloadFiles, deleteFiles } = useUploadFiles();
  // const { fileList } = useFetchFileList(orderID, true);
  
  const {
    control,
  } = useForm({});

  const navigate = useNavigate(); 

  // useEffect(() => {
  //   setOrderID(orderIDPass);    
  //   if (fileList) {
  //     setExistingFiles(fileList);
  //     setExistingFilteredFiles(fileList);
  //   }
  //   // console.log(fileList);
  // }, [orderIDPass, fileList]);

  // Handle multiple file changes
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleUpload = async (file) => {    
    // Prepare form data for upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("orderID", orderID);
    formData.append("referenceCollection", "Assignment");
    formData.append("fileCategory", "assignment");
    formData.append("writerFlag", true);
    
    try {      
      const response = await uploadFiles(formData);
      console.log("Response Data:", response);
      setUploadSuccess(true);
    } catch (error) {
      console.log("Error submitting form: ", error.message);
    }
  };

  // const handleView = async (file) => {
  //   downloadFiles(file, false);
  // };

  // const handleDelete = async (file) => {
  //   try {
  //     const response = await deleteFiles(file._id);
  //     console.log(response.message);
  //     navigate(0);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleDownload = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // const handleCategoryChange = (category) => {
  //   const filteredFiles = existingFiles.filter(
  //     (file) => file.category === category
  //   );
  //   // console.log(filteredFiles);

  //   setExistingFilteredFiles(filteredFiles);
  // };
  return (
    <Card raised style={{ padding: "20px", borderRadius: "10px" }}>
      <IconButton
        aria-label="close"
        onClick={() => close(false)}
        sx={{
          position: "relative",
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <CardContent>
        <Typography
          variant="h4"
          gutterBottom
          mb={3}
          align="center"
          style={{ fontWeight: "bold", color: "#1976d2" }}
        >
          {main ? "File View" : "File Upload"}
        </Typography>

        <Grid container spacing={2} display="flex" alignItems="center">
          <Grid item xs={12} sm={6}>
            <Controller
              name="orderID"
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
                />
              )}
            />
          </Grid>
          {!main && <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              component="label"
              color="secondary"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Upload Attachments
              <input
                type="file"
                onChange={handleFileChange}
                hidden
                multiple
              />
            </Button>
          </Grid>}
        </Grid>
        {/* Render table if files are uploaded */}
        {!main && files.length > 0 && (
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
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

        {/* {main && !isModule && (
          <Grid container spacing={2} mt={3}>
            <Grid item xs={4}>
              <Typography
                variant="h5"
                gutterBottom
                align="center"
                sx={{ color: "#1976d2", cursor: "pointer" }}
                onClick={() => handleCategoryChange("assignment")}
              >
                Assignment Files
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="h5"
                gutterBottom
                align="center"
                sx={{ color: "#1976d2", cursor: "pointer" }}
                onClick={() => handleCategoryChange("payment")}
              >
                Payment Files
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="h5"
                gutterBottom
                align="center"
                sx={{ color: "#1976d2", cursor: "pointer" }}
                onClick={() => handleCategoryChange("grades")}
              >
                Grade Files
              </Typography>
            </Grid>
          </Grid>
        )}

        {main && existingFilteredFiles.length > 0 && (
          <Box mt={3}>
            <TableContainer
              component={Paper}
              sx={{ marginTop: "20px", ...customScrollbarStyles }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">File Name</TableCell>
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
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )} */}
      </CardContent>
    </Card>
  );
};

export default PortalFileUpload;
