import Order from '../models/order.models.js';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { createLog } from './log.controller.js';
import { app } from "../utils/firebaseConfig.js";

import {
  getStorage,
  ref,
  deleteObject,
} from "firebase/storage";
import File from '../models/files.model.js';


// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Set the destination folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${req.params.orderID}_${file.originalname}`); // Name the file with orderID prefix
//   }
// });

// const upload = multer({ storage });

// Create a new order with orderID and referenceNumber
export const newOrder = async (req, res) => {
  const {orderIDList} = req.body
  const testToken = req.headers.authorization;

  if (!testToken) {
    return res.status(401).json({error: "Unauthorized",message: "Authentication is required to access this resource.",});
  }

  const token = testToken.split(" ")[1];
  const decoded = jwt.decode(token);

  const userGroup = decoded.userRole;  
  
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
        orderLog.unacceptedOrders = [...orderLog.unacceptedOrders, order];
      } else {
        const homeLink = `/allOrders`;

        // Create a new order document
        const order = new Order({ orderID, referenceNumber, group: userGroup });
        const savedOrder = await order.save();
        // Update metadata with _id and save again
        savedOrder.metadata = { goTo: `${homeLink}`, dataId: savedOrder._id };
        await savedOrder.save();
        orderLog.acceptedOrders = [...orderLog.acceptedOrders, order];
      }
    }

    // Construct a log message with summary details
    const logMessage = `New orders processed. Accepted Orders: ${
      orderLog.acceptedOrders.length
    }, Unaccepted Orders: ${
      orderLog.unacceptedOrders.length
    }.`;

    // Create the log entry using the modified createLog helper
    // await createLog({ req, collection: "Order", action: "create", logMessage, isPortal: true });

    res.status(201).json({ message: "Order created successfully", orderLog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
};

// Retrieve all orders and allow file upload under each orderID
export const getAllOrders = async (req, res) => {
  
  try {
    const { refNo } = req.query;
    const testToken = req.headers.authorization;

    if (!testToken) {
      return res.status(401).json({ error: "Unauthorized", message: "Authentication is required to access this resource." });
    }

    const token = testToken.split(' ')[1];
    const decoded = jwt.decode(token);
    
    const userGroup = decoded.userRole;
    var orders;
    

    // Check if the user's group matches "edu" or "pen"
    if (!["edu", "pen"].includes(userGroup)) {      
      orders = refNo
        ? await Order.find(
            { referenceNumber: { $regex: refNo, $options: "i" } },
            "orderID referenceNumber group linkStatus"
          )
        : await Order.find({}, "orderID referenceNumber group linkStatus");
    } else {      
    // Filter orders based on refNo if provided, and user group
      orders = refNo
        ? await Order.find(
            {
              referenceNumber: { $regex: refNo, $options: "i" },
              group: userGroup,
            },
            "orderID referenceNumber group linkStatus"
          )
        : await Order.find(
            { group: userGroup },
            "orderID referenceNumber group linkStatus"
          );
    }



    // If refNo is provided but no matching order is found, send a 404 response
    if (refNo && orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// // Middleware for handling file uploads for a specific orderID
// export const uploadFile = [
  
//   upload.single('file'), // Middleware to handle single file upload
//   async (req, res) => {
//     try {
//       const { orderID, category } = req.params;

//       // Check if the orderID exists
//       const order = await Order.findOne({ orderID });
//       if (!order) {
//         return res.status(404).json({ error: "Order not found" });
//       }

//       if (!category) {
//         return res.status(400).json({ message: "Category is required" });
//       }

//       // If file is uploaded successfully
//       res.status(200).json({
//         message: "File uploaded successfully",
//         file: req.file
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// ];

export const getAllOrderList = async (req, res) => {
  try {
    const { refNo } = req.params; // Get refNo from query parameters
    // Ensure refNo is provided, if not return a 400 error
    if (!refNo) {
      return res
        .status(400)
        .json({ message: "Reference number (refNo) is required" });
    }

    // Retrieve all order IDs associated with the provided reference number
    const orders = await Order.find(
      { referenceNumber: refNo },
      "orderID" // Only retrieve the orderID field
    );

    // // If no orders are found for the provided reference number, send a 404 response
    // if (orders.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ message: "No orders found for the provided reference number" });
    // }

    // Return a list of order IDs in an array
    const orderIDs = orders.map((order) => order.orderID);
    res.status(200).json({ referenceNumber: refNo, orderIDs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ---- helpers ----
const extractFirebasePath = (fileUrl) => {
  // same regex approach as your fileDelete route
  const matches = fileUrl?.match(/\/o\/(.*?)\?/);
  return matches && matches[1] ? decodeURIComponent(matches[1]) : null;
};

const storage = getStorage(app);

export const deleteOrderById = async (req, res) => {
  
  try {
    const { orderID: orderMongoId } = req.params; // Step 1) find by _id from params

    const order = await Order.findById(orderMongoId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Step 1.5) Cannot delete if linkStatus is true
    if (order.linkStatus === true) {
      return res.status(409).json({
        error: "Order is linked (linkStatus=true). Unlink before deletion.",
        orderID: order.orderID,
      });
    }

    const fileIds = Array.isArray(order.fileList) ? order.fileList : [];
    // Nothing to delete? Just delete the order
    if (fileIds.length === 0) {
      await Order.deleteOne({ _id: order._id });
      return res.status(200).json({
        message: "Order deleted (no files were attached).",
        orderID: order.orderID,
        deletedFilesCount: 0,
        totalFiles: 0,
      });
    }
    const failures = [];
    let deletedFilesCount = 0;

    // Step 2/3/4) If fileList has IDs, delete Firebase object first, THEN delete File doc
    for (const fileId of fileIds) {      
      try {
        const fileDoc = await File.findById(fileId);        
        if (!fileDoc) {
          // If DB doc is missing, we treat it as a failure (or skip). Here we fail so you know.
          failures.push({
            fileId: String(fileId),
            reason: "File doc not found",
          });
          continue;
        }

        // --- delete from Firebase ---
        if (!fileDoc.fileUrl) {
          failures.push({ fileId, reason: "File URL missing on file doc" });
          continue;
        }        

        // ✅ Corrected Extraction of Firebase File Path
        const fileUrl = fileDoc.fileUrl;
        
        const matches = fileUrl.match(/\/o\/(.*?)\?/);
        const filePath =
          matches && matches[1] ? decodeURIComponent(matches[1]) : null;        

        if (!filePath) {
          failures.push({ fileId, reason: "Failed to extract Firebase path" });
          //   continue;
        }
        
        // Delete the storage object (same as your reference code)
        const storageRef = ref(storage, decodeURIComponent(filePath));
        
        await deleteObject(storageRef);

        // --- delete the File doc from Mongo ---
        await File.findByIdAndDelete(fileDoc._id);
        deletedFilesCount += 1;
        console.log(deletedFilesCount);
        
      } catch (err) {
        failures.push({
          fileId: String(fileId),
          reason: err?.message || "Unknown error",
        });
      }
    }

    // If any file deletion failed, stop here and DO NOT delete the order
    if (failures.length > 0) {
      return res.status(500).json({
        error: "Failed to delete one or more files. Order not deleted.",
        orderID: order.orderID,
        failures,
        deletedFilesCount,
        totalFiles: fileIds.length,
      });
    }

    // All files (if any) were deleted successfully → delete the Order object
    await Order.deleteOne({ _id: order._id });

    return res.status(200).json({
      message: "Order and associated files deleted successfully.",
      orderID: order.orderID,
      deletedFilesCount,
      totalFiles: fileIds.length,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the order." });
  }
};

