import mongoose from "mongoose";
import { fileDB } from "../db/connectMongoDB.js";
import { getNextSequence } from "./counter.models.js";

const fileSchema = new mongoose.Schema(
  {
    fileID: {
      type: String,
      unique: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    referenceID: {
      type: mongoose.Schema.Types.ObjectId, // Stores ObjectId
      default: null,
    },
    referenceCollection: {
      type: String, // Stores collection name to identify source
      required: true,
    },
    orderID: {
      type: String,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileCategory: {
      type: String,
      enum: ["assignment", "payment", "grades", "submissionEvidence", "brief"],
      required: true,
    },
    writerFlag: {
      type: Boolean,
      default: false,
      required: true,
    },
    paymentFlag: {
      type: Boolean,
      default: false,
      required: true,
    },
    uploadedByUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    uploadedByUserName: {
      type: String,
      required: true,
    },
    metadata: {
      type: Object,
      default: {},
    }, // Extra data (optional)
  },
  { timestamps: true }
);

// Pre-save hook to generate the userID before saving the document
fileSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Construct a unique counter key based on role and year
    const counterKey = `file-${this.referenceCollection}-${this.fileCategory}-${this.orderID !== undefined || "" ? "O" : 'G'}`;
    const seq = await getNextSequence(counterKey);
    // Format the fileID as FILE-REF-CAT-O-0001, e.g., ADMIN-2025-0001
    this.fileID = `${counterKey.toUpperCase()}-${seq.toString().padStart(4, '0')}`;
  }
  next();
});

const File = fileDB.model("File", fileSchema, "File");

export default File;
