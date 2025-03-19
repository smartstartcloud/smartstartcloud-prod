import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

const degreeSchema = new mongo.Schema({
  degreeID: {
    type: String,
    required: true,
    unique: true,
  },
  degreeName: {
    type: String,
    required: true,
  },
  degreeYear: {
    type: String,
    required: true,
  },
  degreeAgent: {
    type: mongo.Schema.Types.ObjectId,
  },
  degreeStudentList: [
    {
      type: mongo.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  degreeModules: [
    {
      type: mongo.Schema.Types.ObjectId,
      ref: "Module",
    },
  ],
  metadata: {
    type: Object,
    default: {},
  }, // Extra data (optional)
});
const Degree = infoDB.model("Degree", degreeSchema,"Degree");
export default Degree;