import express from 'express'
const app = express.Router()

app.get("/",async (req,res)=>{
    res.sendStatus(200);
})

export default app;
