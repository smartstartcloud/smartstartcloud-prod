import mongo from 'mongoose';
import {fileDB} from '../db/connectMongoDB.js';

const orderSchema = new mongo.Schema({
  orderID: {
    type: String,
    required: true,
    unique: true,
  },
  referenceNumber: {
    type: String,
    required: true,
  },
  group: {
    type:String,
    required: true,
  }, // The writer group
  linkStatus: {
    type: Boolean,
    required: true,
    default: false
  },
  assignmentConnected:{
    type: mongo.Schema.Types.ObjectId,
    ref: "Assignment",
  },
});

const Order = fileDB.model('Order', orderSchema);
export default Order;
