import dotenv from './utils/env.js';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import degreeRoutes from './routes/degree.routes.js';
import moduleRoutes from './routes/module.routes.js';
import { newAccessToken } from './utils/generateToken.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import './db/connectMongoDB.js'; // MongoDB connection file
import mongoose from 'mongoose'; // For MongoDB operations
import multer from 'multer'; // For file handling
import File from './models/files.model.js'; // Import the File model to store binary data in MongoDB

// Initialize express app
const app = express();

// Set up multer for file uploads (store files in memory as a buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Token checking middleware for restricted uploads
// const verifyShareableToken = (req, res, next) => {
//   const token = req.query.token || req.headers['x-access-token'];
//   if (!token) {
//     return res.status(403).send({ message: 'No token provided. Access denied.' });
//   }

//   // Verify the token (replace JWT_SECRET with your secret)
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: 'Invalid or expired token.' });
//     }

//     // Token is valid, continue to next middleware
//     req.fileId = decoded.fileId; // Optionally pass the fileId
//     next();
//   });
// };

// File upload route with token restriction (BSON)
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Save the file as BSON (binary data) in MongoDB
    const newFile = new File({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileData: req.file.buffer
    });

    await newFile.save();
    res.json({ message: 'File uploaded successfully', file: newFile });
  } catch (err) {
    res.status(500).send({ message: 'Error uploading file', error: err.message });
  }
});

// Shareable link upload route (no token restriction)
app.post('/share/upload', upload.single('file'), async (req, res) => {
  try {
    // Save the file as BSON (binary data) in MongoDB
    const newFile = new File({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileData: req.file.buffer
    });

    await newFile.save();
    res.json({ message: 'File uploaded successfully', file: newFile });
  } catch (err) {
    res.status(500).send({ message: 'Error uploading file', error: err.message });
  }
});

// File download route (retrieve from MongoDB)
app.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).send('File not found');
    }

    // Set headers for file download
    res.set({
      'Content-Type': file.fileType,
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
    });

    res.send(file.fileData); // Send the binary data
  } catch (err) {
    res.status(500).send('Error downloading file');
  }
});

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: ["http://localhost:3000", "https://www.smartstart.cloud", "https://smartstart.cloud", "www.smartstart.cloud"],
  credentials: true,
}));



// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/degree", degreeRoutes);
app.use("/api/module", moduleRoutes);
app.use('/newAccessToken', newAccessToken);

// Start the server
app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

export default app;
