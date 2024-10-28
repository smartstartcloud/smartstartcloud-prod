import Order from '../models/order.model.js';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.orderID}_${file.originalname}`); // Name the file with orderID prefix
  }
});

const upload = multer({ storage });

// Create a new order with orderID and referenceNo
export const newOrder = async (req, res) => {
  try {
    const { orderID, referenceNo } = req.body;

    // Check if the orderID already exists
    const existingOrder = await Order.findOne({ orderID });
    if (existingOrder) {
      return res.status(400).json({ error: "Order ID already exists" });
    }

    // Create a new order document
    const order = new Order({ orderID, referenceNo });
    await order.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Retrieve all orders and allow file upload under each orderID
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}, 'orderID referenceNo'); // Fetch all orders with only orderID and referenceNo fields

    res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Middleware for handling file uploads for a specific orderID
export const uploadFile = [
  upload.single('file'), // Middleware to handle single file upload
  async (req, res) => {
    try {
      const { orderID } = req.params;

      // Check if the orderID exists
      const order = await Order.findOne({ orderID });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // If file is uploaded successfully
      res.status(200).json({
        message: "File uploaded successfully",
        file: req.file
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
];
