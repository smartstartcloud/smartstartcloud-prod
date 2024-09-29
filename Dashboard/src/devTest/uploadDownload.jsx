import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // For accessing query params
import { Button, Container, Typography, Box, Card, CardContent, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ShareIcon from '@mui/icons-material/Share';
import axios from 'axios';

const UploadDownload = () => {
    const [files, setFiles] = useState([]);
    const [token, setToken] = useState(null);
    const [shareableLink, setShareableLink] = useState('');

    // Get token from the URL
    const location = useLocation();
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromURL = params.get('token');
        setToken(tokenFromURL);
    }, [location]);

    const handleFileChange = async (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);

        // Prepare form data for upload
        const formData = new FormData();
        formData.append('file', selectedFiles[0]);

        try {
            let url = '/upload';
            if (token) {
                url = `/share/upload?token=${token}`;
            }
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('File uploaded successfully', response.data);
        } catch (error) {
            console.error('Error uploading file', error);
        }
    };

    // Function to generate a shareable link
    const handleGenerateShareableLink = () => {
        const currentUrl = window.location.href.split('?')[0]; // Remove any existing query parameters
        const newToken = 'GENERATED_SHAREABLE_TOKEN'; // Replace with actual token generation logic
        const newLink = `${currentUrl}?token=${newToken}`;
        setShareableLink(newLink);

        // Optionally, copy the shareable link to the clipboard
        navigator.clipboard.writeText(newLink)
            .then(() => {
                alert('Shareable link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
            });
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '50px' }}>
            <Card raised style={{ padding: '20px', borderRadius: '10px' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                        File Upload
                    </Typography>

                    <Box component="div" sx={{ marginTop: '20px', textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            component="label"
                            color="secondary"
                            startIcon={<CloudUploadIcon />}
                            style={{ padding: '10px 20px', marginBottom: '20px', marginRight: '10px' }}
                        >
                            Upload Attachments
                            <input
                                type="file"
                                onChange={handleFileChange}
                                hidden
                                multiple
                            />
                        </Button>

                        {/* Show "Share this page" button only if there is no token */}
                        {!token && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ShareIcon />}
                                onClick={handleGenerateShareableLink}
                                style={{ padding: '10px 20px' }}
                            >
                                Share This Page
                            </Button>
                        )}

                        {/* Display the generated shareable link */}
                        {shareableLink && (
                            <Typography variant="body1" style={{ marginTop: '10px' }}>
                                Shareable Link: <a href={shareableLink}>{shareableLink}</a>
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default UploadDownload;
