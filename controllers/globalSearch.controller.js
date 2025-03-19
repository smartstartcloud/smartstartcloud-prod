import User from "../models/user.models.js";
import Degree from "../models/degree.models.js";
import Module from "../models/module.models.js";
import Assignment from "../models/assignment.models.js";
import Student from "../models/student.models.js";
import Order from "../models/order.models.js";
import File from "../models/files.model.js";
import ModuleStudentFinance from "../models/moduleStudentFinance.models.js";

// Helper function to build query and select string based on all string fields
const buildSearchQuery = (model, searchQuery) => {
  const regex = new RegExp(searchQuery, "i");
  const excludeArray = [
    "_id",
    "metadata",
    "assignmentNature",
    "referenceCollection",
    "fileCategory",
  ]; // Add keys you want to exclude
  // Extract only fields with instance "String" (ignoring ObjectId and others)
  let stringFields = Object.keys(model.schema.paths)
    .filter((key) => model.schema.paths[key].instance === "String")
    .filter((field) => field !== "password");

  // Adding metadata field
  stringFields.push("metadata");

  // Remove excluded fields from final list
  stringFields = stringFields.filter((key) => !excludeArray.includes(key));
  console.log(stringFields);
  
  // Build an array of OR conditions for each string field
  const conditions = stringFields.map((field) => ({ [field]: regex }));
  // Return the query object and a space-separated string of selected fields
  return {
    query: { $or: conditions },
    select: stringFields.join(" "),
  };
};

export const globalSearch = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Missing search query" });
    }

    // Users
    const userQuery = buildSearchQuery(User, query);
    const users = await User.find(userQuery.query).select(userQuery.select);

    // Degrees
    const degreeQuery = buildSearchQuery(Degree, query);
    const degrees = await Degree.find(degreeQuery.query).select(
      degreeQuery.select
    );

    // Modules
    const moduleQuery = buildSearchQuery(Module, query);
    const modules = await Module.find(moduleQuery.query).select(
      moduleQuery.select
    );

    // Assignments
    const assignmentQuery = buildSearchQuery(Assignment, query);
    const assignments = await Assignment.find(assignmentQuery.query).select(
      assignmentQuery.select
    );

    // Students
    const studentQuery = buildSearchQuery(Student, query);
    const students = await Student.find(studentQuery.query).select(
      studentQuery.select
    );

    // Orders
    const orderQuery = buildSearchQuery(Order, query);
    const orders = await Order.find(orderQuery.query).select(orderQuery.select);

    // Files
    const fileQuery = buildSearchQuery(File, query);
    const files = await File.find(fileQuery.query).select(fileQuery.select);

    // Payments (ModuleStudentFinance)
    const paymentQuery = buildSearchQuery(ModuleStudentFinance, query);
    const payments = await ModuleStudentFinance.find(paymentQuery.query).select(
      paymentQuery.select
    );

    const results = {
      users,
      degrees,
      modules,
      assignments,
      students,
      orders,
      files,
      payments,
    };

    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error("Error during global search:", error);
    res.status(500).json({ error: error.message });
  }
};
