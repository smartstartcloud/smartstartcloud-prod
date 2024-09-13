import mongo from 'mongoose';
import {connectMongoDegree} from '../db/connectMongoDB.js';

const degrees = process.env.DEGREES.split(',');

const db = await connectMongoDegree();

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

let degreeSchemaArray = [];
for(let i of degrees){
    degreeSchemaArray.push(db.model(i, degreeSchema, i));
}

export default degreeSchemaArray;