import dotenv from "./utils/env.js";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import degreeRoutes from "./routes/degree.routes.js";
import moduleRoutes from "./routes/module.routes.js";
import { newAccessToken } from "./utils/generateToken.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import "./db/connectMongoDB.js"; // MongoDB connection file
import multer from "multer"; // For file handling
import fileRoutes from "./routes/files.routes.js";
import orderRoutes from "./routes/order.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import searchRoutes from "./routes/search.routes.js";
import {
  fileUpload,
  fileDownload,
} from "./controllers/firebaseFile.controller.js";
import { fileURLToPath } from "url";
import path from "path";
import logRoutes from "./routes/log.routes.js";

// Initialize express app
const app = express();

//To deploy Frontend and Backend in save Heroku App
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "Dashboard/build"))); //To connect react app

const isDevelopment = process.env.NODE_ENV === "development";

// Common trusted sources
const commonSources = [
  "'self'",
  "https://www.smartstart.cloud",
  "https://smartstart.cloud",
  "www.smartstart.cloud",
  "https://portal.smartstart.cloud",
  "portal.smartstart.cloud",
  "https://smartstartcloud-prod-ce5fd15fc35b.herokuapp.com",
  "https://staging.smartstart.cloud"
];

// Add development-specific sources
if (isDevelopment) {
  commonSources.push("http://portal.localhost:3000", "http://localhost:3000");
}

//CSP Configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: commonSources,
        connectSrc: commonSources,
      },
    },
  })
);

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("trust proxy", 1); // Trust Heroku's proxy
app.use(
  cors({
    origin: [
      "http://portal.localhost:3000",
      "http://localhost:3000",
      "https://www.smartstart.cloud",
      "https://smartstart.cloud",
      "https://portal.smartstart.cloud",
      "https://smartstartcloud-prod-ce5fd15fc35b.herokuapp.com",
      "https://staging.smartstart.cloud"
    ],
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
app.use("/api/notification", notificationRoutes);
app.use("/api/log", logRoutes);
app.use("/api/search", searchRoutes);

//Test File Firebase
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.post("/fileUpload", upload.single("file"), fileUpload);
app.get("/fileDownload", fileDownload);

//To deploy Frontend and Backend in save Heroku App
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Dashboard/build", "index.html")); //To connect react app
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

export default app;
