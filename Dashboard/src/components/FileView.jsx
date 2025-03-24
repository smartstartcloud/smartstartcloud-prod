import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Grid,
  useTheme,
  Modal,
  CardMedia,
  Button,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import useUploadFiles from "../hooks/useUploadFiles";
import { enumToString, formatDate } from "../utils/functions";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useAuthContext } from "../context/AuthContext";
import { tokens } from "../theme";
import FileUpload from '../components/FileUpload';
import { formatDateString } from "../utils/yearFilter";
import { format } from "date-fns";

const customScrollbarStyles = {
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  "scrollbar-width": "none",
};

const FileView = ({
  fileList,
  setOpen,
  open,
  dataToSend,
  statusUpdate,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  
  const {authUser} = useAuthContext()
  const [files, setFiles] = useState([]);
  const { downloadFiles } = useUploadFiles();
  const [data, setData] = useState({})
  const [note, setNote] = useState("");
  const [referenceIdToPass, setreferenceIdToPass] = useState("");
  const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false);

  useEffect(() => {    
    
    if (fileList) {      
      setFiles(fileList);
    }
    if (dataToSend) {
      setreferenceIdToPass(dataToSend.moduleAssignmentID);
      setData(dataToSend);
    }
  }, [fileList, dataToSend]);

  useEffect(() => {
    if (data) {
    }
  }, [data]);

  const handleDownload = async (file) => {
    downloadFiles(file, true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Container maxWidth="lg" sx={{ marginTop: "50px" }}>
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
            <Box mt={3}>
              <Box width="100%" display="flex" justifyContent="space-between">
                {files.length > 0 && (
                  <Typography variant="h3" gutterBottom>
                    File Management
                  </Typography>
                )}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color:
                      data.paymentVerificationStatus !== "approved"
                        ? "error.main"
                        : "success.main",
                  }}
                >
                  {enumToString(
                    "paymentVerificationStatus",
                    data.paymentVerificationStatus
                  )}
                </Typography>
              </Box>
              <Box>
                {data && Object.keys(data).length > 1 && (
                  <Card
                    sx={{
                      width: "100%",
                      p: 1,
                      my: 2,
                      background: `${colors.grey[800]}`,
                      boxShadow: 6,
                      borderRadius: 4,
                      "&:hover": {
                        boxShadow: 12,
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h4"
                        color={colors.grey[100]}
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        Payment Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="h5" color={colors.grey[200]}>
                              <strong>Student Name:</strong> {data.studentName}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="h5" color={colors.grey[200]}>
                              <strong>Degree Year:</strong>{" "}
                              {formatDateString(data.degreeYear)}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="h5" color={colors.grey[200]}>
                              <strong>Degree Name:</strong> {data.degreeName}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="h5" color={colors.grey[200]}>
                              <strong>Module Price:</strong> {data.modulePrice}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="h5" color={colors.grey[200]}>
                              <strong>Paid Amount:</strong> {data.paidAmount}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="h5" color={colors.grey[200]}>
                              <strong>Payment Date:</strong>{" "}
                              {format(data.paymentToDate, "dd/MM/yyyy")}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="h5" color={colors.grey[200]}>
                              <strong>Paid Through:</strong>{" "}
                              {data.paymentMethodDetails}
                            </Typography>
                          </Box>
                          {data.bankPayeeName && (
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="h5" color={colors.grey[200]}>
                                <strong>Payee Name:</strong>{" "}
                                {data.bankPayeeName}
                              </Typography>
                            </Box>
                          )}
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="h5" color={colors.grey[200]}>
                              <strong>Employee:</strong> {data.userName}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}
              </Box>
              {files.length > 0 && (
                <Grid
                  my={1}
                  container
                  spacing={2}
                  sx={{
                    overflowY: "auto",
                    maxHeight: "300px",
                    paddingBottom: "10px",
                  }}
                >
                  {files.map((file) => (
                    <Grid item xs={12} sm={6} md={4} key={file._id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Render Different Media Types */}
                        {file.fileType.startsWith("image/") ? (
                          <CardMedia
                            component="img"
                            alt={file.fileName}
                            height="140"
                            image={file.fileUrl}
                          />
                        ) : file.fileType.startsWith("application/pdf") ? (
                          <CardMedia
                            component="embed"
                            src={file.fileUrl}
                            type="application/pdf"
                            height="140"
                            sx={{ background: "#f0f0f0" }}
                          />
                        ) : (
                          <CardContent>
                            <InsertDriveFileIcon
                              sx={{ fontSize: 50, color: "primary.main" }}
                            />
                            <Typography variant="body2">
                              <a
                                href={file.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {file.fileName}
                              </a>
                            </Typography>
                          </CardContent>
                        )}
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {file.fileName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {formatDate(file.updatedAt)}
                          </Typography>
                        </CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <IconButton onClick={() => handleDownload(file)}>
                            <CloudDownloadIcon />
                          </IconButton>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              <Box>
                {data.approvalNoteLog && data.approvalNoteLog.length > 0 ? (
                  <TableContainer
                    component={Paper}
                    sx={{ maxHeight: "220px", overflowX: "auto" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: "20%" }}>
                            <b>Date</b>
                          </TableCell>
                          <TableCell sx={{ width: "10%" }}>
                            <b>User</b>
                          </TableCell>
                          <TableCell sx={{ width: "50%" }}>
                            <b>Message</b>
                          </TableCell>
                          <TableCell sx={{ width: "10%" }}>
                            <b>Status</b>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[...data.approvalNoteLog]
                          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort descending by date
                          .map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{formatDate(row.date)}</TableCell>
                              <TableCell>{row.approvedBy}</TableCell>
                              <TableCell>{row.approvalNote}</TableCell>
                              <TableCell>{row.approvalStatus}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography
                    variant="h5"
                    color={colors.grey[50]}
                    sx={{ mb: 2 }}
                  >
                    NO PAYMEN LOGS
                  </Typography>
                )}
              </Box>
              <Box sx={{ width: "100%", maxWidth: 500, mx: "auto", mt: 5 }}>
                <Typography variant="h6" gutterBottom>
                  Take a Note
                </Typography>
                <TextField
                  label="Your Note"
                  variant="outlined"
                  multiline
                  rows={1}
                  fullWidth
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Currently Logged in: {authUser.name}
                </Typography>
              </Box>
              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                gap={5}
                mt={3}
              >
                <Button
                  variant={"contained"}
                  color={"success"}
                  sx={{ minWidth: "100px" }}
                  onClick={() => statusUpdate(data, note, "approved")}
                >
                  Approve
                </Button>
                <Button
                  variant={"contained"}
                  color={"error"}
                  sx={{ minWidth: "100px" }}
                  onClick={() => statusUpdate(data, note, "rejected")}
                >
                  Reject
                </Button>
                <Button
                  variant={"outlined"}
                  color={"error"}
                  sx={{ minWidth: "100px" }}
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  variant={"contained"}
                  color={"secondary"}
                  sx={{ minWidth: "100px" }}
                  onClick={() => setFileUploadModalOpen(true)}
                >
                  Upload File
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
        {fileUploadModalOpen && (
          <FileUpload
            setOpen={setFileUploadModalOpen}
            open={fileUploadModalOpen}
            referenceID={referenceIdToPass}
            referenceCollection={"ModuleAssignment"}
            isPayment={true}
          />
        )}
      </Container>
    </Modal>
  );
};

export default FileView;
