import mongo from 'mongoose';
import {connectMongoInformation} from '../db/connectMongoDB.js';

const db = await connectMongoInformation();

const degreeSchema = mongo.Schema({
    dID: {
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    },
    studentList:[{
        type: mongo.Schema.Types.ObjectId,
        ref:"Student"
    }],
    modules:{
        type: Array
    }
})
const Degree =db.model("Degree", degreeSchema,"Degree");
export default Degree;