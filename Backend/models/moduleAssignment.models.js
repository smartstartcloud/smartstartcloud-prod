import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

const moduleAssignmentSchema = new mongo.Schema({
    moduleID:{
        type: String,
        required: true
    },
    orderID: [{
        type: String,
        ref:"Assignment"
    }],
    studentID: {
        type: String,
        required: true
    }
})
const ModuleAssignment = infoDB.model("Module Assignment", moduleAssignmentSchema,"Module Assignment");
export default ModuleAssignment;