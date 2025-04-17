import mongo from "mongoose";
import { infoDB } from "../db/connectMongoDB.js";
import mongoose from "mongoose";
import { getNextSequence } from "./counter.models.js";

const paymentGroupSchema = new mongoose.Schema({
  paymentGroupID: {
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
  paidAmount: {
    type: String,
    default: "0",
  },
  totalPaymentToDate: {
    type: String,
  },
  paymentList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ModuleStudentFinance",
      required: true,
    },
  ],
  metadata: {
    type: Object,
    default: {},
  }, // Extra data (optional)
});

// Pre-save hook to generate the userID before saving the document
paymentGroupSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Construct a unique counter key based on role and year
    const counterKey = `pg`;
    const seq = await getNextSequence(counterKey);
    // Format the userID as ROLE-YYYY-NNNN, e.g., ADMIN-2025-0001
    this.financeID = `${counterKey.toUpperCase()}-${seq
      .toString()
      .padStart(4, "0")}`;
  }
  next();
});

const PaymentGroup = infoDB.model(
  "PaymentGroup",
  paymentGroupSchema
);
export default PaymentGroup;
