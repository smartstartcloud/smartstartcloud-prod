import jwt from 'jsonwebtoken'

const generateAccessToken = (userId) => {
    const token = jwt.sign({userId},process.env.JWT_KEY,{expiresIn:"30s"})
    return token
};


const generateRefreshToken = (userId, res) => {
    const token = jwt.sign({userId},process.env.JWT_KEY,{expiresIn:"1h"})
    res.cookie('refreshToken',token,{httpOnly: true, maxAge: 24*60*60*1000, secure: true, sameSite: "strict"}) 
};


export{generateAccessToken,generateRefreshToken}