import mongoose from 'mongoose';
import { infoDB } from "../db/connectMongoDB.js";

const logSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  affectedID: {
    type: mongoose.Schema.Types.ObjectId,
    // Optional: set required: true if every log must have an affectedID
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  collectionName: {
    type: String,
    required: true,
  },
  action: {
    // Store details about the change; it can be a string or a more complex object
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  message: {
    // A human-readable description of what was done
    type: String,
    required: true,
  },
});

const Log = infoDB.model("Log", logSchema);
export default Log;
