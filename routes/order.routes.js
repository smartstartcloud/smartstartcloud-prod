import express from 'express';
import { newOrder, getAllOrders, getAllOrderList, deleteOrderById } from '../controllers/order.controller.js';

const router = express.Router();

// Route to create a new order
router.post('/new', newOrder);

// Route to get all orders
router.get('/all', getAllOrders);

// Route to get all orders by ref
router.get("/orderList/:refNo", getAllOrderList);

// Route to upload a file under a specific orderID
// router.post('/:orderID/upload', uploadFile);

// Route to delete an order by ID
router.delete("/:orderID", deleteOrderById);

export default router;
