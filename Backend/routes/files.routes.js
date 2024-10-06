import express from 'express';
import multer from 'multer';
import { uploadFile, downloadFile, deleteFile, listFiles, listFilesByOrderID, generateShareableLink, accessFileViaShareableLink } from '../controllers/files.controller.js';

// Initialize express router
const router = express.Router();

// Set up multer for file uploads (store files in memory as a buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to upload a file
router.post('/upload', upload.single('file'), uploadFile);

// Route to download a file by ID
router.post('/download', downloadFile);

// Route to get a file list by ID
router.post('/list/singleFile', listFilesByOrderID);

// Route to delete a file by ID
router.delete('/delete/:id', deleteFile);

// Route to list all files
router.get('/list', listFiles);

// Route to generate a shareable link for a file by orderID
router.post('/shareable-link', generateShareableLink);

// Route to access file via shareable link (upload or download)
router.post('/access/:orderID', upload.single('file'), accessFileViaShareableLink);

export default router;
