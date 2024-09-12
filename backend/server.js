import dotenv from './utils/env.js'
import express from 'express'
import authRoutes from './routes/auth.routes.js'
import dummyRequestRoute from "./controllers/dummyRequest.js"
import protect from './middlewares/protect.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import cluster from 'cluster'
import cpu from 'os'

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
    const app = express()
    app.use(cookieParser());

    app.set('view engine','ejs');
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use((cors({
        origin: true,  // Or set to true for dynamic origin
        credentials: true
    })));

    app.use("/api/auth", authRoutes);
    app.use("/dummyRequest", protect,dummyRequestRoute); //USE POSTMAN TO CHECK

    app.listen(process.env.PORT, () => {
        console.log(`listening on port ${process.env.PORT}`);
    })
}




