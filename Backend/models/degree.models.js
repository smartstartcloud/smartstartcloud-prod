import mongo from 'mongoose';
import {infoDB} from '../db/connectMongoDB.js';

const degreeSchema = mongo.Schema({
    degreeID : {
        type: String,
        required: true,
        unique: true
    },
    degreeName:{
        type: String,
        required: true
    },
    degreeYear: {
        type: String,
        required: true
    },
    degreeAgent:{
        type: String,
        required: true
    },
    degreeStudentList:[{
        type: mongo.Schema.Types.ObjectId,
        ref:"Student"
    }],
    degreeModules:{
        type: Array
    }
})
const Degree = infoDB.model("Degree", degreeSchema,"Degree");
export default Degree;