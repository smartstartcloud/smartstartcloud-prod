import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const UploadDownload = () => {
    const [file, setFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('http://localhost:5000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                setUploadedFileName(response.data.file); // Set the filename returned by the server
                alert('File uploaded successfully');
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            alert('Please choose a file first.');
        }
    };

    const handleDownload = async () => {
        if (uploadedFileName) {
            const link = document.createElement('a');
            link.href = `http://localhost:5000/download/${uploadedFileName}`;
            link.download = uploadedFileName;
            link.click();
        } else {
            alert('No file available to download.');
        }
    };

    return (
        <Container style={{ marginTop: '50px' }}>
            <Typography variant="h4" gutterBottom>
                Attachment Upload and Download
            </Typography>
            
            <input
                type="file"
                onChange={handleFileChange}
                style={{ marginBottom: '20px' }}
            />

            <div>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleUpload}
                    style={{ marginRight: '10px' }}
                >
                    Upload Attachment
                </Button>

                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={handleDownload}
                >
                    Download Attachment
                </Button>
            </div>
        </Container>
    );
}

export default UploadDownload;
