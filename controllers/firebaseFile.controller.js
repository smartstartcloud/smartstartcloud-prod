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
      action: "upload",
      logMessage,
      affectedID: newFile._id,
      actionToDisplay: `Uploaded file "${fileName}"`,
      isFile: true,
      userID: uploadedByUserID,
    });
    await newFile.save();

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

    // Log the file download action before streaming
    const logMessage = `File "${file.fileName}" (ID: ${
      file._id
    }) was downloaded.`;
    // await createLog({
    //   req,
    //   collection: "File",
    //   action: "download",
    //   logMessage,
    //   affectedID: file._id,
    // });

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
    const logMessage = `File "${deletedFile.fileName}" (ID: ${deletedFile.fileID}) was deleted.`;
    await createLog({
      req,
      collection: "File",
      action: "delete",
      actionToDisplay: "File Deleted",
      logMessage,
      affectedID: deletedFile._id,
    });

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