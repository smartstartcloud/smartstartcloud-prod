import mongo from "mongoose";
import { infoDB } from "../db/connectMongoDB.js";

// Define a counter schema and model to track sequence numbers for different collections
const counterSchema = new mongo.Schema({
  _id: { type: String, required: true }, // e.g., "module"
  seq: { type: Number, default: 0 },
});

const Counter = infoDB.model("Counter", counterSchema);

// Utility function to atomically get the next sequence number for a given counter name
export const getNextSequence = async (name) =>  {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}