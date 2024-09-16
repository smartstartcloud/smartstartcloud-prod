import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

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
const Degree = infoDB.model("Degree", degreeSchema,"Degree");
export default Degree;