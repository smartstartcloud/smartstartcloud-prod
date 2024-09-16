import mongo from 'mongoose';
import {connectMongoInformation} from '../db/connectMongoDB.js';

const db = await connectMongoInformation();

const studentSchema = mongo.Schema({
    studentName: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        required: true,
        unique: true
    },
    studentContact: {
        type: String,
        required: true
    },
    studentLogin: {
        type: String,
        required: true,
    },
    studentPassword: {
        type: String,
        required: true
    },
    studentAssignment: {
        type: Array,
        default: []
    }
});

const Student = db.model("Student", studentSchema, "Student");
export default Student;