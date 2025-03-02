import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

const studentSchema = new mongo.Schema({
  studentName: {
    type: String,
    required: true,
  },
  studentID: {
    type: String,
    required: true,
    unique: true,
  },
  studentContact: {
    type: String,
    // required: true
  },
  studentLogin: {
    type: String,
    // required: true,
  },
  studentPassword: {
    type: String,
    // required: true
  },
  studentOfficePassword: {
    type: String,
  },
  studentOther: {
    type: String,
  },
  groupName: {
    type: String,
  },
  tutorName: {
    type: String,
  },
  campusLocation: {
    type: String,
  },
  universityName: {
    type: String,
  },
  courseName: {
    type: String,
  },
  year: {
    type: String,
  },
  isExternal: {
    type: Boolean,
    default: false
  },
  studentAssignment: {
    type: Array,
    default: [],
  },
  metadata: {
    type: Object,
    default: {},
  }, // Extra data (optional)
});

const Student = infoDB.model("Student", studentSchema, "Student");
export default Student;