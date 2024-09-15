import dotenv from './utils/env.js'
import express from 'express'
import authRoutes from './routes/auth.routes.js'
import dummyRequestRoute from "./controllers/dummyRequest.js"
import protect from './middlewares/protect.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import cluster from 'cluster'
import cpu from 'os'
import newDegree from './controllers/newDegree.js'
import './models/degree.models.js'
import './models/user.models.js'


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

    app.set('view engine','ejs');
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use((cors({
        origin: true,  // Or set to true for dynamic origin
        credentials: true
    })));

    app.use("/api/auth", authRoutes);
    app.use("/dummyRequest", protect,dummyRequestRoute); 
    app.use("/api/newDegree",newDegree);
}