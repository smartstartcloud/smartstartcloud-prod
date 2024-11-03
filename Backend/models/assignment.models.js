import mongo from "mongoose";
import { infoDB } from "../db/connectMongoDB.js";

const AssignmentSchema = new mongo.Schema({
  orderID: {
    type: String,
    sparse: true, // Marks this field to allow unique values only when not null
  },
  assignmentName: {
    type: String,
    required: true,
  },
  assignmentType: {
    type: String,
    required: true,
  },
  assignmentDeadline: {
    type: String,
    required: true,
  },
  assignmentProgress: {
    type: String,
  },
  assignmentPayment: {
    type: String,
  },
  assignmentGrade: {
    type: String,
  },
  assignmentFile: {
    type: Array,
    default: [],
  },
  assignmentNature: {
    type: String,
  },
});

// Create a unique sparse index on `orderID`
AssignmentSchema.index({ orderID: 1 }, { unique: true, sparse: true });

const Assignment = infoDB.model("Assignment", AssignmentSchema, "Assignment");
export default Assignment;
