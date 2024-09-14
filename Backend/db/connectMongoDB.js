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
const connectMongoInformation = async ()=>{
    try {
        const db = await mongo.createConnection(process.env.MONGO_DB_URI_INFORMATION);
        db.on(`error`, console.error.bind(console, `connection error:`));
        db.once(`open`, function () {console.log(`MongoDB connected on INFORMATION`);});
        return db;
        
    } catch (error) {
        console.log("Error connecting Database", error);
    }
}


export {connectMongoAuth,connectMongoInformation};
