import express from 'express'
import jwt from 'jsonwebtoken'
const app = express.Router()

app.get("/",async (req,res,next)=>{
    const testToken = req.headers.authorization;
    //Check if token exists
    let token;
    if(testToken){
        token = testToken.split(' ')[1];
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                res.status(400).json({error: "User is not logged in"});
            }else{
                next();
            }
        });
    }else{
        res.status(400).json({error: "User is not logged in"});
    }
})

export default app;
