import express from 'express'
import jwt from 'jsonwebtoken'
import { generateAccessToken } from '../utils/generateToken.js';
const app = express.Router()

app.get("/",async (req,res,next)=>{
    const testToken = req.headers.authorization;
    
    //Check if token exists
    let token;
    if (!testToken) return res.status(401).json({"error": "Unauthorized", "message": "Authentication is required to access this resource."});;

    if(testToken){
        token = testToken.split(' ')[1];
        jwt.verify(token, process.env.JWT_KEY, (err) => {
            
            if (err) {
                res.status(403).json({"error": "Forbidden in protect route", "message": "You do not have permission to access this resource."});
            }else{
                next();
            }
        });
    }else{
        res.status(400).json({error: "User is not logged in"});
    }
})

// Token refresh route
app.post('/token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) return res.status(403).json({"error": "Forbidden in token Route", "message": "No Refresh Token"});  

  jwt.verify(refreshToken, process.env.JWT_KEY, (err, user) => {
    if (err) return res.status(403).json({"error": "Forbidden in token Route", "message": "You do not have permission to access this resource."});
    // `user` contains the decoded data (e.g., userId, roles)
    const userId = user.userId; // Extract userId from the token
    const newAccessToken = generateAccessToken(userId);
    res.status(200).json({ accessToken: newAccessToken });
  });
});

export default app;
