import express from 'express'
const app = express.Router()
import jwt from 'jsonwebtoken'

const generateAccessToken = (userId,userRole) => {
    const token = jwt.sign({userId,userRole},process.env.JWT_KEY,{expiresIn:"5s"})
    return token
};


const generateRefreshToken = (userId,userRole,res) => {
    const token = jwt.sign({userId,userRole},process.env.JWT_KEY,{expiresIn:"10s"})
    res.cookie('refreshToken',token,{httpOnly: true, maxAge: 24*60*60*1000, secure: true, sameSite: "strict"}) 
};

const newAccessToken = app.post("/",async (req,res)=>{
    const refreshToken = req.cookies.refreshToken;
      
    if (!refreshToken) return res.status(403).json({"error": "Forbidden in token Route", "message": "No Refresh Token"});  
  
    jwt.verify(refreshToken, process.env.JWT_KEY, (err, user) => {
      if (err) return res.status(404).json({"error": "Forbidden in token Route", "message": "You do not have permission to access this resource."});
      // `user` contains the decoded data (e.g., userId, roles)
      const userId = user.userId; // Extract userId from the token
      const newAccessToken = generateAccessToken(userId);
      res.status(200).json({ accessToken: newAccessToken });
    });
  })

export{generateAccessToken,generateRefreshToken,newAccessToken}