import Assignment from "../models/assignment.models.js";
import File from "../models/files.model.js";
import { forceMongo } from "../utils/forceMongoFieldNotUnique.js";

// Controller to generate a shareable link
// export const generateShareableLink = (req, res) => {
//   try {
//     const { orderID } = req.body;

//     if (!orderID) {
//       return res.status(400).json({ message: "Order ID is required" });
//     }

//     // const shareableLink = `${req.protocol}://${req.get('host')}/api/files/access/${orderID}`;
//     const shareableLink = `${orderID}`;

//     res
//       .status(200)
//       .json({
//         message: "Shareable link generated successfully",
//         shareableLink,
//       });
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         message: "Error generating shareable link",
//         error: error.message,
//       });
//   }
// };

// Controller to access a file via shareable link (for both upload and download)
// export const accessFileViaShareableLink = async (req, res) => {
//   try {
//     const { orderID } = req.params;
//     const action = req.query.action; // "upload" or "download"

//     if (!orderID) {
//       return res.status(400).json({ message: 'Order ID is required' });
//     }

//     // Find all files related to the given orderID
//     const files = await File.find({ orderID });

//     // Check if no files are found for the given orderID, and handle the download action
//     if (files.length === 0 && action === 'download') {
//       return res.status(404).json({ message: 'No files found for this orderID' });
//     }

//     // Handle file download action
//     if (action === 'download') {
//       // Assuming you're allowing multiple files, you may return a specific file
//       // or loop through the files array to send them one by one
//       const file = files[0]; // In this example, we use the first file

//       // Set headers for file download
//       res.set({
//         'Content-Type': file.fileType,
//         'Content-Disposition': `attachment; filename="${file.fileName}"`,
//       });
//       return res.send(file.fileData);
//     }

//     // Handle file upload action
//     else if (action === 'upload') {
//       if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//       }

//       // Update or insert new file
//       const newFile = await File.findOneAndUpdate(
//         { orderID },
//         {
//           fileName: req.file.originalname,
//           fileType: req.file.mimetype,
//           fileData: req.file.buffer,
//         },
//         { new: true, upsert: true }
//       );
//       await newFile.save();
//       return res.status(201).json({ message: 'File uploaded successfully', fileId: newFile._id });
//     }

//     // Handle invalid action
//     else {
//       return res.status(400).json({ message: 'Invalid action. Use ?action=upload or ?action=download' });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: 'Error accessing file via shareable link', error: error.message });
//   }
// };
