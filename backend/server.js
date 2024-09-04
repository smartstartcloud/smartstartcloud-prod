import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/auth.routes.js'
import connectToMongoDB from './db/connectToMongoDB.js'


// express app
const app = express()
dotenv.config()

app.use(express.json()) // Parse from req body

app.use("/api/auth", authRoutes)

app.listen(process.env.PORT, () => {
    console.log('listening on port 4000');
    connectToMongoDB()

})

