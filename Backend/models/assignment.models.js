import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

const AssignmentSchema = new mongo.Schema({
    orderID:{
        type: String,
        required: true
    },
    assignmentName: [{
        type: String,
        required: true
    }],
    assignmentType: {
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
const Assignment = infoDB.model("Module Assignment", AssignmentSchema,"Assignment");
export default Assignment;