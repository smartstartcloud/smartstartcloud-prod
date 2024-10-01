import dotenv from './utils/env.js'
import express from 'express'
import authRoutes from './routes/auth.routes.js'
import degreeRoutes from './routes/degree.routes.js'
import moduleRoutes from './routes/module.routes.js'
import { newAccessToken } from './utils/generateToken.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import './db/connectMongoDB.js'
import { fileURLToPath } from 'url'
import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage';
import mongoose from 'mongoose'
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
const router = express.Router();

// GridFS starts
// MongoDB URI (from your environment variable)
const mongoURI = process.env.MONGO_DB_URI_INFORMATION;

// Initialize GridFS storage
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads' // GridFS bucket name
                };
                resolve(fileInfo);
            });
        });
    }
});

// Multer setup
const upload = multer({ storage });

// Token checking middleware for restricted uploads
const verifyShareableToken = (req, res, next) => {
    const token = req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ message: 'No token provided. Access denied.' });
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Invalid or expired token.' });
        }

        // Token is valid, continue to next middleware
        req.fileId = decoded.fileId; // Optionally pass the fileId
        next();
    });
};

// File upload route with token restriction
router.post('/upload', verifyShareableToken, upload.single('file'), (req, res) => {
    res.json({ file: req.file });
});

// Shareable link upload route (no token restriction)
router.post('/share/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`listening on port ${process.env.PORT}`);
})

/*
// Get the current directory path --- FOR ES6 Syntax, __dirname doesn't work directly. To connect react app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,'Dashboard/build'))); //To connect react app
*/
//GridFS ends

//Middleware
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet());
app.use((cors({
  origin: ["http://localhost:3000", "https://www.smartstart.cloud","https://smartstart.cloud","www.smartstart.cloud"] ,
  credentials: true,  // To allow cookies
})));

//API
app.use("/api/auth", authRoutes);
app.use("/api/degree",degreeRoutes);
app.use("/api/module", moduleRoutes);
app.use('/newAccessToken',newAccessToken);

/*
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'Dashboard/build','index.html')); //To connect react app
})
*/
export default router;