import dotenv from './utils/env.js'
import express from 'express'
import authRoutes from './routes/auth.routes.js'
import degreeRoutes from './routes/degree.routes.js'
import moduleRoutes from './routes/module.routes.js'
import { newAccessToken } from './utils/generateToken.js'
import dummyRequestRoute from "./controllers/dummyRequest.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import './db/connectMongoDB.js'
import { fileURLToPath } from 'url'
// import path from 'path' // You need to import path for static file serving
/*
const totalCPUs = cpu.cpus().length;
const numWorkers = process.env.WEB_CONCURRENCY || totalCPUs ;

if(cluster.isPrimary) {
  for (var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }
  cluster.on('exit', function() {
    cluster.fork();
  });

} else {
    // express app
    const app = express();
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    })

    app.use(cookieParser());
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(helmet());
    app.use((cors({
        origin: true,  // Or set to true for dynamic origin
        credentials: true
    })));

    app.use("/api/auth", authRoutes);
    app.use("/api/degree", degreeRoutes);
    app.use("/dummyRequest", protect,dummyRequestRoute); 
}
*/
// express app
const app = express();
app.listen(process.env.PORT || 5000, () => {
  console.log(`listening on port ${process.env.PORT}`);
})
/*
// Get the current directory path --- FOR ES6 Syntax, __dirname doesn't work directly. To connect react app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,'Dashboard/build'))); //To connect react app
*/

//Middleware
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet());
app.use((cors({
  origin: ["http://localhost:3000", "https://www.smartstart.cloud"] ,
  credentials: true,  // To allow cookies
})));

//API
app.use("/api/auth", authRoutes);
app.use("/api/degree",degreeRoutes);
app.use("/api/module", moduleRoutes);
app.use("/dummyRequest", dummyRequestRoute);
app.use('/newAccessToken',newAccessToken);

/*
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'Dashboard/build','index.html')); //To connect react app
})
*/