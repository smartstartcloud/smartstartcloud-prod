import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

const AssignmentSchema = new mongo.Schema({
    orderID:{
        type: String,
        unique:true,
        required: true
    },
    assignmentName: {
        type: String,
        required: true
    },
    assignmentType: {
        type: String,
        required: true
    },
    assignmentDeadline: {
        type: String,
        required: true
    },
    assignmentProgress: {
        type: String,
        required: true
    },
    assignmentPayment: {
        type: String,
        required: true
    },
    assignmentFile: {
        type: Array,
        default: []
    },
    
})
const Assignment = infoDB.model("Assignment", AssignmentSchema,"Assignment");
export default Assignment;