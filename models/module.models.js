import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

const moduleSchema = new mongo.Schema({
  moduleName: {
    type: String,
    required: true,
  },
  moduleCode: {
    type: String,
    required: true,
  },
  moduleAssignments: [
    [
      {
        type: mongo.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true,
      },
    ],
  ],
  fileList: [
    {
      type: mongo.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
  metadata: {
    type: Object,
    default: {},
  }, // Extra data (optional)
});

const Module = infoDB.model("Module", moduleSchema, "Module");
export default Module;