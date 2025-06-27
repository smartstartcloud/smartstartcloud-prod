import express from "express";
import multer from "multer";
import {
  fileUpload,
  fileDownload,
  fileDelete,
  listFilesByReferenceID,
  listFiles
} from "../controllers/firebaseFile.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/fileUpload", upload.single("file"), fileUpload);
router.get("/fileDownload/:fileID", fileDownload);

// Route to get a file list by ID
router.post("/list/singleFile/getList", listFilesByReferenceID);

// Route to delete a file by ID
router.delete("/delete/:studentID/:id", fileDelete);

// Route to list all files
router.get("/list", listFiles);

// Route to access file via shareable link (upload or download)
// router.get('/access/:orderID', accessFileViaShareableLink);

export default router;
