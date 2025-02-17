import mongo from "mongoose";
import { infoDB } from "../db/connectMongoDB.js";
import mongoose from "mongoose";

const moduleStudentFinanceSchema = new mongoose.Schema({
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
  modulePrice: {
    type: String,
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
  otherPaymentMethod: {
    type: String,
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
