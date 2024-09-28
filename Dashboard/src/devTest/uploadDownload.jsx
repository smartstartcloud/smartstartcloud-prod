import React, { useState } from 'react';
import { Button, Container, Typography, Box, Card, CardContent } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const UploadDownload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleDownload = () => {
        if (file) {
            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            alert('Please upload a file first.');
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '50px' }}>
            <Card raised style={{ padding: '20px', borderRadius: '10px' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                        Attachment Upload
                    </Typography>

                    <Box 
                        component="div" 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            marginTop: '20px',
                        }}
                    >
                        <Button
                            variant="contained"
                            component="label"
                            color="secondary"
                            startIcon={<CloudUploadIcon />}
                            style={{ padding: '10px 20px', marginBottom: '20px' }}
                        >
                            Upload Attachment
                            <input
                                type="file"
                                onChange={handleFileChange}
                                hidden
                            />
                        </Button>
                        
                        {file && (
                            <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                File selected: <strong>{file.name}</strong>
                            </Typography>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleDownload}
                            startIcon={<CloudDownloadIcon />}
                            style={{ padding: '10px 20px' }}
                        >
                            Download Attachment
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default UploadDownload;