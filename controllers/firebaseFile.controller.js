import File from "../models/files.model.js";
import Assignment from "../models/assignment.models.js";
import { createLog } from "./log.controller.js";
import { app } from "../utils/firebaseConfig.js";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject 
} from "firebase/storage";

import axios from "axios";
import Module from "../models/module.models.js";
import ModuleAssignment from "../models/moduleAssignment.models.js";
import Order from "../models/order.models.js";
import ModuleStudentFinance from "../models/moduleStudentFinance.models.js";

// Import addNewStudentLog if not already imported
import { addNewStudentLog } from "./studentLog.controller.js";

const storage = getStorage(app);

export const fileUpload = async (req, res) => {  
  try {
    const {
      referenceID,
      referenceCollection,
      orderID,
      fileCategory,
      uploadedByUserID,
      uploadedByUserName,
      writerFlag,
      paymentFlag,
      parentID,
      fileName,
      fileType,
      fileUrl,
    } = req.body;    

    if (!fileUrl) {
      return res.status(400).json({ error: "File URL is required" });
    }

    let studentID = null;

    if (referenceCollection === "Assignment") {
      const assignment = await Assignment.findById(referenceID);
      studentID = assignment?.studentID;
    } else if (referenceCollection === "ModuleStudentFinance") {
      const finance = await ModuleStudentFinance.findById(referenceID);
      studentID = finance?.studentID;
    } else if (referenceCollection === "ModuleAssignment") {
      const moduleAssignment = await ModuleAssignment.findById(referenceID);
      studentID = moduleAssignment?.studentID;
    }

    // Save the file data to MongoDB
    const newFile = new File({
      referenceID,
      referenceCollection,
      orderID,
      fileCategory,
      uploadedByUserID,
      uploadedByUserName,
      fileName,
      fileType,
      fileUrl,
      ...(writerFlag && { writerFlag }),
      ...(paymentFlag && { paymentFlag }),
      ...(paymentFlag && { parentID }),
    });

    // Create a log entry for the file upload
    const logMessage = `File "${fileName}" uploaded successfully for ${referenceCollection} with reference ID ${referenceID}.`;
    await createLog({
      req,
      collection: "File",
      action: "fileUpload",
      type: "file",
      logMessage,
      affectedID: newFile._id,
      actionToDisplay: `Uploaded file "${fileName}"`,
      isFile: true,
      userID: uploadedByUserID,
      studentID,
      involvedData: {
        typeData: {
          fileName,
          fileType,
          fileUrl,
          status: "Uploaded"
        }
      }
    });
    await newFile.save();
    // Add new student log after saving file and creating log
    console.log("Creating student log for upload", { studentID, fileName });
    try {
      await addNewStudentLog({
        studentData: {
          _id: studentID,
          studentID,
          studentName: "",
        },
        userID: uploadedByUserID,
        userName: uploadedByUserName || "Unknown",
        action: "fileUpload",
        involvedData: {
          typeData: {
            fileName,
            fileType,
            fileUrl,
            status: "Uploaded",
          },
        },
      });
    } catch (err) {
      console.error("Error saving fileUpload to studentLogs:", err.message);
    }

    if (referenceCollection === "Assignment") {
      if (writerFlag) {
        // Add the new file ID to the assignment's `assignmentFile` array
        const order = await Order.findOne({ orderID }); // Find the Assignment document by its ID);
        order.fileList.push(newFile._id);
        // Save the updated assignment
        await order.save();
      } else {
        const assignment = await Assignment.findByIdAndUpdate(
          { _id: referenceID }, // Find the Assignment document by its ID
          { $push: { fileList: newFile._id } }, // Push new file ID into "assignmentFile" array
          { new: true } // Return updated document
        );
      }
    } else if (referenceCollection === "Module") {
      const module = await Module.findByIdAndUpdate(
        { _id: referenceID }, // Find the Module document by its ID
        { $push: { fileList: newFile._id } }, // Push new file ID into "assignmentFile" array
        { new: true } // Return updated document
      );
      newFile.metadata = module.metadata
    } else if (referenceCollection === "ModuleStudentFinance") {
      console.log("ashche ekhane", parentID);

      const moduleAssignment = await ModuleAssignment.findByIdAndUpdate(
        { _id: parentID }, // Find the Module document by its ID
        { $push: { fileList: newFile._id } }, // Push new file ID into "assignmentFile" array
        { new: true } // Return updated document
      );
      if (moduleAssignment) {
        newFile.metadata = moduleAssignment.metadata;
        const payment = await ModuleStudentFinance.findByIdAndUpdate(
          { _id: referenceID }, // Find the Module document by its ID
          { $push: { fileList: newFile._id } }, // Push new file ID into "assignmentFile" array
          { new: true } // Return updated document
        );
        // // Find all finance records where moduleAssignmentID matches referenceID
        // const financeRecords = await ModuleStudentFinance.find({
        //   moduleAssignmentID: referenceID,
        // });
        // // Update each finance record by adding the new file ID to fileList
        // await Promise.all(
        //   financeRecords.map(async (finance) => {
        //     await ModuleStudentFinance.findByIdAndUpdate(
        //       finance._id,
        //       { $push: { fileList: newFile._id } },
        //       { new: true }
        //     );
        //   })
        // );
      }
    }
    await newFile.save();
    res
      .status(201)
      .json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    console.log(error.message);
    return res.status(400).send(error.message);
  }
};

export const fileDownload = async (req, res) => {
  try {
    const { fileID } = req.params;    
    const file = await File.findById(fileID);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    let studentID = null;

    if (file.referenceCollection === "Assignment") {
      const assignment = await Assignment.findById(file.referenceID);
      studentID = assignment?.studentID;
    } else if (file.referenceCollection === "ModuleStudentFinance") {
      const finance = await ModuleStudentFinance.findById(file.referenceID);
      studentID = finance?.studentID;
    } else if (file.referenceCollection === "ModuleAssignment") {
      const moduleAssignment = await ModuleAssignment.findById(file.referenceID);
      studentID = moduleAssignment?.studentID;
    }

    // Log the file download action before streaming
    const logMessage = `File "${file.fileName}" (ID: ${file._id}) was downloaded.`;
    await createLog({
      req,
      collection: "File",
      action: "fileDownload",
      type: "file",
      logMessage,
      affectedID: file._id,
      actionToDisplay: `Downloaded file "${file.fileName}"`,
      isFile: true,
      studentID,
      involvedData: {
        typeData: {
          fileName: file.fileName,
          fileType: file.fileType,
          fileUrl: file.fileUrl,
          status: "Downloaded"
        }
      }
    });
    // Add new student log after logging download
    console.log("Creating student log for download", { studentID, file: file?.fileName });
    try {
      await addNewStudentLog({
        studentData: {
          _id: studentID,
          studentID,
          studentName: "",
        },
        userID: req.userId,
        userName: req.userName || "Unknown",
        action: "fileDownload",
        involvedData: {
          typeData: {
            fileName: file.fileName,
            fileType: file.fileType,
            fileUrl: file.fileUrl,
            status: "Downloaded",
          },
        },
      });
    } catch (err) {
      console.error("Error saving fileDownload to studentLogs:", err.message);
    }

    // Fetch the file from Firebase using axios
    const firebaseResponse = await axios.get(file.fileUrl, {
      responseType: "stream",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const progress = (loaded / total) * 100;
        console.log(`Download progress: ${progress.toFixed(2)}%`);
      },
    });

    // Set headers for download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.fileName}"`
    );
    res.setHeader("Content-Type", file.fileType);

    // Stream the file content to the client
    firebaseResponse.data.pipe(res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error downloading file", error: error.message });
  }
};

// Controller to handle file deletion by ID
export const fileDelete = async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!fileId) {
      return res.status(400).json({ message: "File ID not provided." });
    }

    // Find the file metadata in MongoDB
    const deletedFile = await File.findById(fileId);
    if (!deletedFile) {
      return res.status(404).json({ message: "File not found in database." });
    }

    // Extract Firebase file URL
    const fileUrl = deletedFile.fileUrl;
    if (!fileUrl) {
      return res
        .status(404)
        .json({ message: "File URL not found in metadata" });
    }

    // Get the Firebase storage reference from the file URL
    // ✅ Corrected Extraction of Firebase File Path
    const matches = fileUrl.match(/\/o\/(.*?)\?/);
    const filePath =
      matches && matches[1] ? decodeURIComponent(matches[1]) : null;
      
    if (!filePath) {
      console.error("Invalid Firebase file path:", fileUrl);
      return res
        .status(500)
        .json({ message: "Failed to extract Firebase path" });
    }

    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, decodeURIComponent(filePath));

    // Step 1: Delete File from Firebase Storage
    try {
      await deleteObject(storageRef);
      console.log(`File "${deletedFile.fileName}" deleted from Firebase`);
    } catch (error) {
      console.error("Firebase file delete error:", error.message);
      return res.status(500).json({
        message: "Failed to delete file from Firebase",
        error: error.message,
      });
    }

    // Step 2: Delete File Metadata from MongoDB
    await File.findByIdAndDelete(fileId);

    // Step 3: Remove file references in relevant collections
    const referenceCollection = deletedFile.referenceCollection;
    if (referenceCollection === "Assignment") {
      if (deletedFile.writerFlag || deletedFile.orderID) {
        await Order.updateMany(
          { fileList: fileId },
          { $pull: { fileList: fileId } }
        );
      }
      await Assignment.updateMany(
        { fileList: fileId },
        { $pull: { fileList: fileId } }
      );
    } else if (referenceCollection === "Module") {
      await Module.updateMany(
        { fileList: fileId },
        { $pull: { fileList: fileId } }
      );
    } else if (referenceCollection === "ModuleAssignment") {
      await ModuleAssignment.updateMany(
        { fileList: fileId },
        { $pull: { fileList: fileId } }
      );
      await ModuleStudentFinance.updateMany(
        { fileList: fileId },
        { $pull: { fileList: fileId } }
      );
    }

    // Step 4: Log the deletion event
    // Lookup studentID from the reference collection
    let studentID = null;
    if (deletedFile.referenceCollection === "Assignment") {
      const assignment = await Assignment.findById(deletedFile.referenceID);
      studentID = assignment?.studentID;
    } else if (deletedFile.referenceCollection === "ModuleStudentFinance") {
      const finance = await ModuleStudentFinance.findById(deletedFile.referenceID);
      studentID = finance?.studentID;
    } else if (deletedFile.referenceCollection === "ModuleAssignment") {
      const moduleAssignment = await ModuleAssignment.findById(deletedFile.referenceID);
      studentID = moduleAssignment?.studentID;
    }
    const logMessage = `File "${deletedFile.fileName}" (ID: ${deletedFile._id}) was deleted.`;
    await createLog({
      req,
      collection: "File",
      action: "delete",
      type: "file",
      isFile: true,
      logMessage,
      affectedID: deletedFile._id,
      actionToDisplay: "File Deleted",
      studentID,
      involvedData: {
        typeData: {
          fileName: deletedFile.fileName,
          fileType: deletedFile.fileType,
          fileUrl: deletedFile.fileUrl,
          status: "Deleted",
          deletedAt: new Date().toISOString(),
        }
      }
    });
    // Add new student log after logging deletion
    console.log("Creating student log for deletion", { studentID, file: deletedFile?.fileName });
    try {
      await addNewStudentLog({
        studentData: {
          _id: studentID,
          studentID,
          studentName: "",
        },
        userID: req.userId,
        userName: req.userName || "Unknown",
        action: "delete",
        involvedData: {
          typeData: {
            fileName: deletedFile.fileName,
            fileType: deletedFile.fileType,
            fileUrl: deletedFile.fileUrl,
            status: "Deleted",
            deletedAt: new Date().toISOString(),
          },
        },
      });
    } catch (err) {
      console.error("Error saving fileDelete to studentLogs:", err.message);
    }

    res.status(200).json({
      success: true,
      message:
        "File deleted from Firebase and MongoDB, and references updated successfully.",
      deletedFile,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res
      .status(500)
      .json({ message: "Error deleting file", error: error.message });
  }
};

// Controller to list all files
export const listFiles = async (req, res) => {
  try {
    const files = await File.find({}, "fileName fileType createdAt");
    res.json({ files });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error listing files", error: error.message });
  }
};

// Controller to list all files by order ID
export const listFilesByReferenceID = async (req, res) => {
  try {
    const { referenceID, isOrder, orderID, parentID } = req.body;     
    console.log(req.body);
           
    let files;
    if (isOrder) {
      files = await File.find(
        { orderID },
        "fileName fileType fileCategory createdAt uploadedByUserName writerFlag paymentFlag"
      );
    } else {
      if (!referenceID) {
        return res.status(400).json({ message: "Reference ID is required" });
      }
      files = await File.find(
        { referenceID },
        "fileName fileType fileCategory createdAt uploadedByUserName writerFlag paymentFlag"
      );
      if (orderID) {
        const writerFiles = await File.find(
          { orderID: orderID },
          "fileName fileType fileCategory createdAt uploadedByUserName writerFlag paymentFlag"
        );
        files = [...files, ...writerFiles];
      }
      if (parentID) {
        const moduleAssignmentFiles = await File.find(
          { referenceID: parentID, paymentFlag: true },
          "fileName fileType fileCategory createdAt uploadedByUserName writerFlag paymentFlag"
        );
        files = [...files, ...moduleAssignmentFiles];
      }   
    }
     
    res.status(200).json(files || []);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error listing files", error: error.message });
  }
};