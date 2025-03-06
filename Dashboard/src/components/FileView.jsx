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
} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import useUploadFiles from "../hooks/useUploadFiles";
import { enumToString, formatDate } from "../utils/functions";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

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
  const [files, setFiles] = useState([]);
  const { downloadFiles } = useUploadFiles();
  const [data, setData] = useState([])

  useEffect(() => {    
    if (fileList) {
      setFiles(fileList);
    }
    if (dataToSend) {
      setData(dataToSend);
    }
  }, [fileList, dataToSend]);

  const handleDownload = async (file) => {
    downloadFiles(file, true);
  };

  const handleCloseModal = () => {
    setOpen(false);
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
            {files.length > 0 && (
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  File Management
                </Typography>
                <Grid container spacing={2}>
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
              </Box>
            )}
          </CardContent>

          <Button
          fullWidth
            variant={
              data.paymentVerificationStatus !== "approved"
                ? "outlined"
                : "contained"
            }
            color={
              data.paymentVerificationStatus !== "approved"
                ? "error"
                : "success"
            }
            onClick={(event) => {
              event.stopPropagation(); // Prevents the row click event
              // Ensure setData correctly updates state
              setData((prev) => ({
                ...prev,
                paymentVerificationStatus:
                  data.paymentVerificationStatus === "approved"
                    ? "awaiting approval"
                    : "approved",
              }));
              statusUpdate(data);
            }}
          >
            {enumToString('paymentVerificationStatus', data.paymentVerificationStatus)}
          </Button>
        </Card>
      </Container>
    </Modal>
  );
};

export default FileView;
