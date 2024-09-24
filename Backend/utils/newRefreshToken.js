import express from 'express'
const app = express.Router()
import jwt from 'jsonwebtoken'
import { generateAccessToken } from '../utils/generateToken.js';

app.post("/",async (req,res)=>{
  const refreshToken = req.cookies.refreshToken;
    
  if (!refreshToken) return res.status(403).json({"error": "Forbidden in token Route", "message": "No Refresh Token"});  

  jwt.verify(refreshToken, process.env.JWT_KEY, (err, user) => {
    if (err) return res.status(403).json({"error": "Forbidden in token Route", "message": "You do not have permission to access this resource."});
    // `user` contains the decoded data (e.g., userId, roles)
    const userId = user.userId; // Extract userId from the token
    const newAccessToken = generateAccessToken(userId);
    res.status(200).json({ accessToken: newAccessToken });
  });
})

export default app;
