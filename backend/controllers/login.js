import express from 'express'
const app = express.Router()
import bcrypt from 'bcryptjs'
import User from '../models/user.models.js'
import jwt from 'jsonwebtoken'


function createAccessToken(username){
    return jwt.sign({username},process.env.JWT_KEY,{expiresIn:"2m"});
}


function createRefreshsToken(username){
    return jwt.sign({username},process.env.JWT_KEY,{expiresIn:"5m"});
}


app.get("/",async (req,res)=>{
    return res.render("login");
})

app.post('/',async(req,res)=>{
    try {
    const user = await User.findOne({ userName: req.body.username }); 
    if (user) {
        await bcrypt.compare( req.body.password, user.password, function(err, result) {
            if (result) {
                const accessToken = createAccessToken(user.userName);
                const refreshToken = createRefreshsToken(user.userName);
                res.cookie('accessToken',accessToken,{httpOnly: true, maxAge:5*60*1000, secure:true});
                res.json({"refreshToken":refreshToken});
                } else {
                    return res.status(400).json({error: "Invalid Username or Password"});
                }
        });
    } else {
        return res.status(400).json({error: "Invalid Username or Password"});
    }
    } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
    }
})
export default app;
