import Assignment from '../models/assignment.models.js';
import File from '../models/files.model.js';
import { forceMongo } from '../utils/forceMongoFieldNotUnique.js';

// Controller to handle file upload
export const uploadFile = async (req, res) => {
  try {
    const { orderID } = req.body; // Use orderID from params (token in shareable link)

    if (!orderID) {
      return res.status(400).json({ message: "Order ID (token) is required" });
    }

    // Find the assignment with the given orderID
    const assignment = await Assignment.findOne({ orderID });

    // Check if the assignment exists
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    forceMongo(File,"orderID");
    // Save the file data to MongoDB
    const newFile = new File({
      orderID: orderID, // Use orderID as token
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileData: req.file.buffer,
    });
    
    await newFile.save();
    // Add the new file ID to the assignment's `assignmentFile` array
    assignment.assignmentFile.push(newFile._id);
    // Save the updated assignment
    await assignment.save();

    res
      .status(201)
      .json({ message: "File uploaded successfully", fileId: newFile._id });
  } catch (error) {    
    console.log(error)
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

// Controller to handle file download by orderID (as token)
export const downloadFile = async (req, res) => {
  try {
    const { fileID } = req.params;  // Get fileID from URL parameters

    const download = req.query.download
    // Find the file by orderID (token)
    const file = await File.findById(fileID);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Set headers for file download
    res.set({
      "Content-Type": file.fileType,
      "Content-Disposition": download
        ? `attachment; filename="${file.fileName}"` // Trigger file download
        : "inline", // Open file in browser
    });

    // Send the file binary data
    res.send(file.fileData);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading file', error: error.message });
  }
};

// Controller to handle file deletion by ID
export const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;

    // Find the file by ID and delete it
    const deletedFile = await File.findByIdAndDelete(fileId);
    if (!deletedFile) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
};

// Controller to list all files
export const listFiles = async (req, res) => {
  try {
    const files = await File.find({}, 'fileName fileType createdAt');
    res.json({ files });
  } catch (error) {
    res.status(500).json({ message: 'Error listing files', error: error.message });
  }
};

// Controller to list all files
export const listFilesByOrderID = async (req, res) => {  
  try {
    const {orderID} = req.params;    
    
    const files = await File.find({orderID}, 'fileName fileType createdAt');
    
    res.json(files || [] );
  } catch (error) {
    res.status(500).json({ message: 'Error listing files', error: error.message });
  }
};
