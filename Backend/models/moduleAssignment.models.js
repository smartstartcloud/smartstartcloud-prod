import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';
import mongoose from 'mongoose';

const moduleAssignmentSchema = new mongoose.Schema({
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    moduleID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true
    },
    assignments: [
      {
        orderID: { type: String, required: true, unique: true },
        assignmentName: { type: String, required: true },
        assignmentType: { type: String, required: true },
        assignmentDeadline: { type: String, required: true }
      }
    ]
  });
  
const ModuleAssignment = mongoose.model('ModuleAssignment', moduleAssignmentSchema);
export default ModuleAssignment;