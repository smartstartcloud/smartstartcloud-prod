import mongo from "mongoose";
import { infoDB } from "../db/connectMongoDB.js";
import mongoose from "mongoose";

const moduleStudentFinanceSchema = new mongoose.Schema({
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
  },
  paymentVerificationStatus: {
    type: String,
    default: "awaiting approval",
  },
  paymentLog: [
    {
      date: { type: Date },
      logString: { type: String },
    },
  ],
});

const ModuleStudentFinance = infoDB.model(
  "ModuleStudentFinance",
  moduleStudentFinanceSchema
);
export default ModuleStudentFinance;
