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
    } = req.body;    
    

    const storageRef = ref(storage, req.file.originalname);

    const metadata = {
      contentType: req.file.mimetype,
    };    

    const uploadTask = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(uploadTask.ref);

    // Save the file data to MongoDB
    const newFile = new File({
      referenceID,
      referenceCollection,
      orderID,
      fileCategory,
      uploadedByUserID,
      uploadedByUserName,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileUrl: downloadURL,
      ...(writerFlag && { writerFlag }),
      ...(paymentFlag && { paymentFlag }),
    });

    // Create a log entry for the file upload
    const logMessage = `File "${
      req.file.originalname
    }" uploaded successfully for ${referenceCollection} with reference ID ${referenceID}.`;
    await createLog({
      req,
      collection: "File",
      action: "upload",
      logMessage,
      affectedID: newFile._id,
      actionToDisplay: `Uploaded file "${req.file.originalname}"`,
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
    } else if (referenceCollection === "ModuleAssignment") {
      const moduleAssignment = await ModuleAssignment.findByIdAndUpdate(
        { _id: referenceID }, // Find the Module document by its ID
        { $push: { fileList: newFile._id } }, // Push new file ID into "assignmentFile" array
        { new: true } // Return updated document
      );
      newFile.metadata = moduleAssignment.metadata;
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
      return res.status(400).json({ message: "File ID not found" });
    }

    // Find the file by ID and delete it from Mongo
    const deletedFile = await File.findByIdAndDelete(fileId);
    if (!deletedFile) {
      return res.status(404).json({ message: "File not found" });
    }
    // Find the file by fileName and delete it from Firebase
    const storageRef = ref(storage, deletedFile.fileName);
    deleteObject(storageRef)
      .then(() => {
        console.log(`${deletedFile.fileName} deleted from Firebase`);
      })
      .catch((error) => {
        console.log(`Firebase file delete error: ` + error.message);
      });
    const referenceCollection = deletedFile.referenceCollection;    

    if (referenceCollection === "Assignment") {
      if (deletedFile.writerFlag || deletedFile.orderID){
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
      return res.status(200).json({
        success: true,
        message: "File deleted and file references updated successfully",
        deletedFile,
      });
    } else if (referenceCollection === "ModuleAssignment") {
      await ModuleAssignment.updateMany(
        { fileList: fileId },
        { $pull: { fileList: fileId } }
      );

      // Construct a log message and create a log entry
      const logMessage = `File "${deletedFile.fileName}" (ID: ${
        deletedFile._id
      }) was deleted.`;
      await createLog({
        req,
        collection: "File",
        action: "delete",
        logMessage,
        affectedID: deletedFile._id,
      });

      return res.status(200).json({
        success: true,
        message: "File deleted and file references updated successfully",
        deletedFile,
      });
    } else {
      console.error(`Model for collection "${referenceCollection}" not found.`);
      return res.status(404).json({
        success: false,
        message: `Model for collection "${referenceCollection}" not found.`,
      });
    }
  } catch (error) {
    console.log(error);
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