import mongoose from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

const orderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    required: true,
    unique: true
  },
  referenceNo: {
    type: String,
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
