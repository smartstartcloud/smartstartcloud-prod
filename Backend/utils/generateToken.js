import jwt from 'jsonwebtoken'

const generateAccessToken = (userId,userRole) => {
    const token = jwt.sign({userId,userRole},process.env.JWT_KEY,{expiresIn:"30s"})
    return token
};


const generateRefreshToken = (userId,userRole,res) => {
    const token = jwt.sign({userId,userRole},process.env.JWT_KEY,{expiresIn:"1h"})
    res.cookie('refreshToken',token,{httpOnly: true, maxAge: 24*60*60*1000, secure: true, sameSite: "strict"}) 
};


export{generateAccessToken,generateRefreshToken}