import mongo from 'mongoose';

const connectMongoAuth = async ()=>{
    try {
        const db = await mongo.createConnection(process.env.MONGO_DB_URI_AUTH);
        db.on(`error`, console.error.bind(console, `connection error:`));
        db.once(`open`, function () {console.log(`MongoDB connected on AUTH`);});
        return db;
        
    } catch (error) {
        console.log("Error connecting Database", error);
    }
}


const connectMongoDegree = async ()=>{
    try {
        const db = await mongo.createConnection(process.env.MONGO_DB_URI_DEGREE);
        db.on(`error`, console.error.bind(console, `connection error:`));
        db.once(`open`, function () {console.log(`MongoDB connected on DEGREE`);});
        return db;
        
    } catch (error) {
        console.log("Error connecting Database", error);
    }
}


export {connectMongoAuth,connectMongoDegree};