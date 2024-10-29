import Order from '../models/order.models.js';
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
  const {orderIDList} = req.body
  const orderLog = {
    acceptedOrders: [],
    unacceptedOrders: [],
  };
    try {
      
      if (!orderIDList.length) {
        return res.status(404).json({ error: "Order ID list empty" });
      }
      for (let order of orderIDList) {
        const { orderID, referenceNumber } = order;
        // Check if the orderID already exists
        const existingOrder = await Order.findOne({ orderID });
        if (existingOrder) {
          // return res.status(400).json({ error: "Order ID already exists" });
          orderLog.unacceptedOrders = [...unacceptedOrders, order];
        } else {
          // Create a new order document
          const order = new Order({ orderID, referenceNumber });
          await order.save();
          orderLog.acceptedOrders = [...acceptedOrders, order];
        }
      }
      
      res.status(201).json({ message: "Order created successfully", orderLog });
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
