import mongo from "mongoose";
import { infoDB } from "../db/connectMongoDB.js";
import { getNextSequence } from './counter.models.js';


const logSchema = new mongo.Schema({
  logID: {
    type: String,
    unique: true,
  },
  user: {
    type: mongo.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  affectedID: {
    type: mongo.Schema.Types.ObjectId,
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
    type: mongo.Schema.Types.Mixed,
    required: true,
  },
  actionToDisplay: {
    type: String,
  },
  message: {
    // A human-readable description of what was done
    type: String,
    required: true,
  },
  metadata: {
    type: Object,
    default: {},
  }, // Extra data (optional)
});

// Pre-save hook to generate the userID before saving the document
logSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Construct a unique counter key based on role and year
    const counterKey = `log-${this.collectionName}`;
    const seq = await getNextSequence(counterKey);
    // Format the userID as ROLE-YYYY-NNNN, e.g., ADMIN-2025-0001
    this.logID = `${counterKey.toUpperCase()}-${seq.toString().padStart(4, '0')}`;
  }
  next();
});

const Log = infoDB.model("Log", logSchema);
export default Log;
