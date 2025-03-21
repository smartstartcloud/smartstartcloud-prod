import mongo from "mongoose";
import { infoDB } from "../db/connectMongoDB.js";

const AssignmentSchema = new mongo.Schema(
  {
    assignmentID: {
      type: String,
      sparse: true, // Marks this field to allow unique values only when not null
    },
    orderID: {
      type: String,
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
    wordCount: {
      type: String,
    },
    assignmentProgress: {
      type: String,
      enum: ["TBA", "ORDER ID ASSIGNED", "FILE READY TO UPLOAD", "FILE UPLOADED", "WAITING TO BE GRADED","PASSED", "FAILED",]
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
    metadata: {
      type: Object,
      default: {},
    }, // Extra data (optional)
  },
  { timestamps: true }
);

// Create a unique sparse index on `orderID`
// AssignmentSchema.index({ orderID: 1 }, { unique: true, sparse: true });

const Assignment = infoDB.model("Assignment", AssignmentSchema, "Assignment");
export default Assignment;
