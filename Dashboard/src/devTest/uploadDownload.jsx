import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';

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
            onClick={handleDownload}
            style={{ marginRight: '10px' }}
            >
            Download Attachment
            </Button>
        </div>
        </Container>
    );
}

export default UploadDownload