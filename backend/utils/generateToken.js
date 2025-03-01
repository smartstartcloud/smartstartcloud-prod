import express from 'express'
const app = express.Router()
import jwt from 'jsonwebtoken'

const generateAccessToken = (userId,userRole) => {
    const token = jwt.sign({userId,userRole},process.env.JWT_KEY,{expiresIn:"10s"})
    return token
};


const generateRefreshToken = (userId,userRole,res, expiresIn) => {  
  const token = jwt.sign({userId, userRole},process.env.JWT_KEY,{expiresIn})
  res.cookie("refreshToken", token, {
    httpOnly: true,
    maxAge: expiresIn * 1000,
    secure: true,
    sameSite: "none",
  }); 
};

const newAccessToken = app.post("/",async (req,res)=>{
    const refreshToken = req.cookies.refreshToken;
      
    if (!refreshToken) return res.status(401).json({error: "Forbidden in token Route", "message": "No Refresh Token"});  
  
    jwt.verify(refreshToken, process.env.JWT_KEY, (err, user) => {
      if (err) return res.status(403).json({error: "Refresh Token is not valid access this resourse"});
      const newAccessToken = generateAccessToken(user.userId,user.userRole);
      res.status(200).json({ accessToken: newAccessToken });
    });
  })

const extractToken = (testToken, isFile=false) => {  
  if (isFile) {
    return { userId: '' }; // Return an empty userId for file operations
  }

  if (testToken) {    
    const tokenParts = testToken.split('=');
    if (tokenParts.length < 2) return null; // Handle invalid token format

    const token = tokenParts[1];    

    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_KEY);      
      // Extract user ID and role
      const { userId, userRole } = decoded;
      return { userId, userRole };
    } catch (error) {
      console.error("Invalid or expired token:", error.message);
      return null;
    }
  }

  return null; // Return null if no token is provided
};

export{generateAccessToken,generateRefreshToken,newAccessToken, extractToken}