import dotenv from './utils/env.js'
import express from 'express'
import authRoutes from './routes/auth.routes.js'
import degreeRoutes from './routes/degree.routes.js'
import moduleRoutes from './routes/module.routes.js'
import { newAccessToken } from './utils/generateToken.js'
import dummyRequestRoute from "./controllers/dummyRequest.js"
import protect from './middlewares/protect.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import cluster from 'cluster'
import cpu from 'os'
import helmet from 'helmet'
import './db/connectMongoDB.js'
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
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
})

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet());
app.use((cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Ensure the headers you use are allowed
  credentials: true,  // To allow cookies
})));

app.use("/api/auth", authRoutes);
app.use("/api/degree",degreeRoutes);
app.use("/api/module", moduleRoutes);
app.use("/dummyRequest", protect,dummyRequestRoute);
app.use('/newAccessToken',newAccessToken);
