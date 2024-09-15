import mongo from 'mongoose';
import {connectMongoInformation} from '../db/connectMongoDB.js';

const db = await connectMongoInformation();

const studentSchema = mongo.Schema({
    //PLEASE WRITE YOUR SCHEMA HERE
})
const Student =db.model("Student", studentSchema,"Student");
export default Student;