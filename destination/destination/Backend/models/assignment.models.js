import mongo from "mongoose";
import { infoDB } from "../db/connectMongoDB.js";

const AssignmentSchema = new mongo.Schema(
  {
    orderID: {
      type: String,
      sparse: true, // Marks this field to allow unique values only when not null
    },
    assignmentName: {
      type: String,
    },
    assignmentType: {
      type: String,
    },
    assignmentDeadline: {
      type: String,
    },
    assignmentProgress: {
      type: String,
    },
    assignmentGrade: {
      type: String,
    },
    fileList: [
      {
        type: mongo.Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    assignmentNature: {
      type: String,
    },
    moduleCode: {
      type: String,
    },
    referenceNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create a unique sparse index on `orderID`
AssignmentSchema.index({ orderID: 1 }, { unique: true, sparse: true });

const Assignment = infoDB.model("Assignment", AssignmentSchema, "Assignment");
export default Assignment;
