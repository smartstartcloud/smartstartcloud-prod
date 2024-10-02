import File from '../models/files.model.js';

// Controller to handle file upload
export const uploadFile = async (req, res) => {
  try {
    const { orderID } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!orderID) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Save the file data to MongoDB
    const newFile = new File({
      orderID: orderID,  // Include orderID in the file schema
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileData: req.file.buffer,
    });

    await newFile.save();
    res.status(201).json({ message: 'File uploaded successfully', fileId: newFile._id });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

// Controller to handle file download by ID
export const downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;

    // Find the file by its ID
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set headers for file download
    res.set({
      'Content-Type': file.fileType,
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
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
