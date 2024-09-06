import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/auth.routes.js'
import dummyRequestRoute from "./controllers/dummyRequest.js"
import connectToMongoDB from './db/connectToMongoDB.js'
import protect from './middlewares/protect.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'


import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// express app
const app = express()
app.use(cookieParser());
dotenv.config()

app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use((cors({
    origin: true,  // Or set to true for dynamic origin
    credentials: true
})));
app.use(express.static(__dirname + "/public"));

app.use("/api/auth", authRoutes);
app.use("/dummyRequest", protect,dummyRequestRoute); //USE POSTMAN TO CHECK
app.use("/dummyRequest", protect); //USE POSTMAN TO CHECK


app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
    connectToMongoDB()

})

