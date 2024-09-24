import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

const moduleAssignmentSchema = new mongo.Schema({
    moduleID:{
        type: String,
        required: true
    },
    assignmentID: [{
        type: String,
        required: true
    }],
    studentID: {
        type: String,
        required: true
    }
})
const ModuleAssignment = infoDB.model("Module Assignment", moduleAssignmentSchema,"Module Assignment");
export default ModuleAssignment;