import dotenv from './utils/env.js'
import express from 'express'
import authRoutes from './routes/auth.routes.js'
import degreeRoutes from './routes/degree.routes.js'
import moduleRoutes from './routes/module.routes.js'
import { newAccessToken } from './utils/generateToken.js'
import dummyRequestRoute from "./controllers/dummyRequest.js"
import {protectForAdmin} from './middlewares/protect.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import cluster from 'cluster'
import cpu from 'os'
import helmet from 'helmet'
import './db/connectMongoDB.js'
import multer from 'multer';
import path from 'path';
import fs from 'fs';

/*
const totalCPUs = cpu.cpus().length;
const numWorkers = process.env.WEB_CONCURRENCY || totalCPUs ;

if(cluster.isPrimary) {
  for (var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }
  cluster.on('exit', function() {
    cluster.fork();
  });

} else {
    // express app
    const app = express();
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    })

    app.use(cookieParser());
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(helmet());
    app.use((cors({
        origin: true,  // Or set to true for dynamic origin
        credentials: true
    })));

    app.use("/api/auth", authRoutes);
    app.use("/api/degree", degreeRoutes);
    app.use("/dummyRequest", protect,dummyRequestRoute); 
}
*/
// express app
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Folder to store the uploaded files
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename file to prevent collisions
  }
});

const upload = multer({ storage });

// Middleware to serve files from the "uploads" folder
app.use('/uploads', express.static('uploads'));

// Route for handling file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    res.status(200).json({ message: 'File uploaded successfully.', file: req.file.filename });
});

// Route for downloading files
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath); // This prompts a file download in the browser
    } else {
        res.status(404).json({ message: 'File not found.' });
    }
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
})

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet());
app.use((cors({
    origin: true,  // Or set to true for dynamic origin
    credentials: true
})));

app.use("/api/auth", authRoutes);
app.use("/api/degree",protectForAdmin, degreeRoutes);
app.use("/api/module", moduleRoutes);
app.use("/dummyRequest", protectForAdmin,dummyRequestRoute);
app.use('/newAccessToken',newAccessToken);
