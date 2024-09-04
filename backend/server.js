import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/auth.routes.js'
import loginRoute from "./controllers/login.js"
import connectToMongoDB from './db/connectToMongoDB.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// express app
const app = express()
dotenv.config()

app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use("/api/auth", authRoutes);
app.use("/login", loginRoute);

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
    connectToMongoDB()

})

