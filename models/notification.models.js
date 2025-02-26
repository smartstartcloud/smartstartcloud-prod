import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';
import { getNextSequence } from './counter.models.js';

const notificationSchema = new mongo.Schema({
  notificationID: {
    type: String,
    unique: true,
  },
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

// Pre-save hook to generate the userID before saving the document
notificationSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Construct a unique counter key based on role and year
    const counterKey = `notify-${this.type}`;
    const seq = await getNextSequence(counterKey);
    // Format the userID as ROLE-YYYY-NNNN, e.g., ADMIN-2025-0001
    this.notificationID = `${counterKey.toUpperCase()}-${seq.toString().padStart(4, '0')}`;
  }
  next();
});

const Notification = infoDB.model("Notification", notificationSchema);
export default Notification;