import React, { useState } from 'react';
import { Button, Container, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Paper from '@mui/material/Paper';

const UploadDownload = () => {
    const [files, setFiles] = useState([]);

    // Handle multiple file changes
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    };

    const handleDownload = (file) => {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '50px' }}>
            <Card raised style={{ padding: '20px', borderRadius: '10px' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                        File Upload and Download
                    </Typography>

                    <Box component="div" sx={{ marginTop: '20px', textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            component="label"
                            color="secondary"
                            startIcon={<CloudUploadIcon />}
                            style={{ padding: '10px 20px', marginBottom: '20px' }}
                        >
                            Upload Attachments
                            <input
                                type="file"
                                onChange={handleFileChange}
                                hidden
                                multiple
                            />
                        </Button>
                    </Box>

                    {/* Render table if files are uploaded */}
                    {files.length > 0 && (
                        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">File Name</TableCell>
                                        <TableCell align="center">Upload</TableCell>
                                        <TableCell align="center">Download</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {files.map((file, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{file.name}</TableCell>
                                            <TableCell align="center">
                                                <IconButton color="primary">
                                                    <CloudUploadIcon />
                                                </IconButton>
                                            </TableCell>
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
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default UploadDownload;
