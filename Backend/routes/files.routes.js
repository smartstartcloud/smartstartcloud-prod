import express from 'express';
import multer from 'multer';
import { uploadFile, downloadFile, deleteFile, listFiles } from '../controllers/files.controller.js';

// Initialize express router
const router = express.Router();

// Set up multer for file uploads (store files in memory as a buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to upload a file
router.post('/upload', upload.single('file'), uploadFile);

// Route to download a file by ID
router.get('/download/:id', downloadFile);

// Route to delete a file by ID
router.delete('/delete/:id', deleteFile);

// Route to list all files
router.get('/list', listFiles);

export default router;
