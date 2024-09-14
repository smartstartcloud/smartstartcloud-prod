import mongo from 'mongoose';
import {connectMongoInformation} from '../db/connectMongoDB.js';

const db = await connectMongoInformation();

const degreeSchema = mongo.Schema({
    year: {
        type: String,
        required: true
    },
    student:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    },
    modules:{
        type: Array
    }
})
const degreeSchemaArray =db.model("Degree", degreeSchema,"Degree");
export default degreeSchemaArray;