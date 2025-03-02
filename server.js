import dotenv from "./utils/env.js";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import degreeRoutes from "./routes/degree.routes.js";
import moduleRoutes from "./routes/module.routes.js";
import { newAccessToken } from "./utils/generateToken.js";
import cookieParser from "cookie-parser";
import "./db/connectMongoDB.js"; // MongoDB connection file
import fileRoutes from "./routes/files.routes.js";
import orderRoutes from "./routes/order.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import searchRoutes from "./routes/search.routes.js";
import { fileURLToPath } from "url";
import path from "path";
import logRoutes from "./routes/log.routes.js";

// Initialize express app
const app = express();

const isDevelopment = process.env.NODE_ENV === "development";

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Routes
app.use("/api/api/auth", authRoutes);
app.use("/api/api/degree", degreeRoutes);
app.use("/api/api/module", moduleRoutes);
app.use("/api/newAccessToken", newAccessToken);
app.use("/api/api/files", fileRoutes);
app.use("/api/api/order", orderRoutes);
app.use("/api/api/notification", notificationRoutes);
app.use("/api/api/log", logRoutes);
app.use("/api/api/search", searchRoutes);

//To deploy Frontend and Backend in save Heroku App

//To deploy Frontend and Backend in save Heroku App
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const production = process.env.NODE_ENV === "production";
if (production) {  
  console.log(path.join(__dirname, "Dashboard/build"));
  app.use(express.static(path.join(__dirname, "Dashboard/build"))); //To connect react app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Dashboard/build", "index.html")); //To connect react app
  });
}

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

export default app;
