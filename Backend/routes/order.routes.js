import express from 'express';
import { newOrder, getAllOrders, uploadFile } from '../controllers/order.controller.js';

const router = express.Router();

// Route to create a new order
router.post('/new', newOrder);

// Route to get all orders
router.get('/all', getAllOrders);

// Route to upload a file under a specific orderID
router.post('/:orderID/upload', uploadFile);

export default router;
