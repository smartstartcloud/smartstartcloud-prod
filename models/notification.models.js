import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

const notificationSchema = new mongo.Schema({
    recipients: [{ 
      type: mongo.Schema.Types.ObjectId,
      ref: "User", 
      required: true 
    }], // Array of users who receive the notification

    sender: { 
      type: mongo.Schema.Types.ObjectId,
      ref: "User" 
    }, // The user who triggered the notification (optional)

    type: { 
      type: String, 
      enum: ["message", "alert", "reminder"], 
      required: true 
    }, // Type of notification

    message: { 
      type: String, 
      required: true 
    }, // Notification content

    isReadBy: [{ 
      type: mongo.Schema.Types.ObjectId,
      ref: "User" 
    }], // Array of users who have read it
    metadata: { 
      type: Object, 
      default: {} 
    }, // Extra data (optional)

  },
  { timestamps: true });
const Notification = infoDB.model("Notification", notificationSchema);
export default Notification;