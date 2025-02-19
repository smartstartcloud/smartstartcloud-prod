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
import multer from 'multer'; // For file handling
import fileRoutes from './routes/files.routes.js';
import orderRoutes from './routes/order.routes.js'
import { fileUpload, fileDownload } from './controllers/firebaseFile.controller.js';
import { fileURLToPath} from 'url';
import path from 'path';


// Initialize express app
const app = express();

const isDevelopment = process.env.NODE_ENV === "development";

// Fix `__dirname` for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!isDevelopment) {
  // Serve React frontend in production
  app.use(express.static(path.join(__dirname, "Dashboard/build")));
}

// Common trusted sources
const commonSources = [
  "'self'",
  "https://www.smartstart.cloud",
  "https://smartstart.cloud",
  "https://portal.smartstart.cloud",
  "www.smartstart.cloud",
  "portal.smartstart.cloud",
  "https://static.cloudflareinsights.com", // Added Cloudflare for analytics
];

// Add development-specific sources
if (isDevelopment) {
  commonSources.push("http://portal.localhost:3000", "http://localhost:3000");
}

// CSP Configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [commonSources],
        scriptSrc: [...commonSources, "'unsafe-inline'", "'unsafe-eval'", "https://static.cloudflareinsights.com"],
        styleSrc: [...commonSources, "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: [...commonSources, "https://fonts.gstatic.com"],
        connectSrc: [...commonSources, "https://static.cloudflareinsights.com"],
        imgSrc: [...commonSources, "data:"],
      },
    },
  })
);

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: commonSources,
    credentials: true,
  })
);



// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/degree", degreeRoutes);
app.use("/api/module", moduleRoutes);
app.use("/newAccessToken", newAccessToken);
app.use("/api/files", fileRoutes);
app.use("/api/order", orderRoutes);


// Firebase file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.post("/fileUpload", upload.single("file"), fileUpload);
app.get("/fileDownload", fileDownload);

// Serve frontend in production
if (!isDevelopment) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Dashboard/build", "index.html"));
  });
}


// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

export default app;
