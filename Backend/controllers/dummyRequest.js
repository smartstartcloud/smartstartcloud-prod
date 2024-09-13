import express from 'express'
const app = express.Router()

app.get("/",async (req,res)=>{
    res.status(200).json({message: "ashche"});
})

export default app;
