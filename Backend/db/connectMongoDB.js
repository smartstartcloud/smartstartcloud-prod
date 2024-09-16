import mongo from 'mongoose';

let authDB,infoDB;

async function connectMongoAuth(){
    try {
        const db = await mongo.createConnection(process.env.MONGO_DB_URI_AUTH);
        db.on(`error`, console.error.bind(console, `connection error:`));
        db.once(`open`, function () {console.log(`MongoDB connected on AUTH`);});
        return db;
        
    } catch (error) {
        console.log("Error connecting Database", error);
    }
}
async function connectMongoInformation(){
    try {
        const db = await mongo.createConnection(process.env.MONGO_DB_URI_INFORMATION);
        db.on(`error`, console.error.bind(console, `connection error:`));
        db.once(`open`, function () {console.log(`MongoDB connected on INFORMATION`);});
        return db;
        
    } catch (error) {
        console.log("Error connecting Database", error);
    }
}
authDB = await connectMongoAuth();
infoDB = await connectMongoInformation();

export {authDB,infoDB};
