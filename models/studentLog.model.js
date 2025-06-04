import mongo from "mongoose";
import { infoDB } from "../db/connectMongoDB.js";
import { getNextSequence } from './counter.models.js';


const studentLogSchema = new mongo.Schema({
  logID: {
    type: String,
    unique: true,
  },
  userID: {
    type: mongo.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  affectedStudentID: {
    type: mongo.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  affectedStudentDisplayID: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  action: {
    // Store details about the change; it can be a string or a more complex object
    type: mongo.Schema.Types.Mixed,
    required: true,
  },
  type: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  involvedData: {
    type: Object,
    default: {},
  }, // Extra data (optional)
  metadata: {
    type: Object,
    default: {},
  }, // Extra data (optional)
});

// Pre-save hook to generate the userID before saving the document
studentLogSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Construct a unique counter key based on role and year
    const counterKey = `StudentLog-`;
    const seq = await getNextSequence(counterKey);
    // Format the userID as ROLE-YYYY-NNNN, e.g., ADMIN-2025-0001
    this.logID = `${counterKey.toUpperCase()}-${seq
      .toString()
      .padStart(4, "0")}`;
  }
  next();
});

const StudentLog = infoDB.model("StudentLog", studentLogSchema);
export default StudentLog;
