import mongo from "mongoose";
import { infoDB } from "../db/connectMongoDB.js";
import mongoose from "mongoose";
import { getNextSequence } from "./counter.models.js";

const moduleStudentFinanceSchema = new mongoose.Schema({
  financeID: {
    type: String,
    unique: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  moduleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  moduleAssignmentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ModuleAssignment",
    required: true,
  },
  fileList: [{
    type: mongo.Schema.Types.ObjectId,
    ref: "File",
  }],
  assignmentID: {
    type: mongo.Schema.Types.ObjectId,
    ref: "Assignment",
  },
  degreeID: {
    type: String,
  },
  degreeName: {
    type: String,
  },
  degreeYear: {
    type: String,
  },
  moduleName: {
    type: String,
  },
  modulePrice: {
    type: String,
    default: "0",
  },
  totalPaymentDue: {
    type: String,
  },
  totalPaymentToDate: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  paymentStatus: {
    type: String,
  },
  paidAmount: {
    type: String,
    default: "0",
  },
  bankPaymentMethod: {
    type: String,
  },
  cashPaymentMethod: {
    type: String,
  },
  referredPaymentMethod: {
    type: String,
  },
  otherPaymentMethod: {
    type: String,
    enum: ["cash", "bank", "referral", "other"], // Only these values are allowed
  },
  paymentVerificationStatus: {
    type: String,
    enum: ["approved", "awaiting approval"], // Only these values are allowed
    default: "awaiting approval",
  },
  paymentLog: [
    {
      date: { type: Date },
      logString: { type: String },
    },
  ],
  metadata: {
    type: Object,
    default: {},
  }, // Extra data (optional)
});

// Pre-save hook to generate the userID before saving the document
moduleStudentFinanceSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Construct a unique counter key based on role and year
    const counterKey = `fin`;
    const seq = await getNextSequence(counterKey);
    // Format the userID as ROLE-YYYY-NNNN, e.g., ADMIN-2025-0001
    this.financeID = `${counterKey.toUpperCase()}-${seq
      .toString()
      .padStart(4, "0")}`;
  }
  next();
});

const ModuleStudentFinance = infoDB.model(
  "ModuleStudentFinance",
  moduleStudentFinanceSchema
);
export default ModuleStudentFinance;
