import mongo from 'mongoose';
import {connectMongoAuth} from '../db/connectMongoDB.js';

const db = await connectMongoAuth();

const userSchema = new mongo.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"]
    },
    passRenew:{
        type: Boolean
    }
})

const User =db.model("users", userSchema);

export default User;