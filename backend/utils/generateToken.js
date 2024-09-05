import jwt from 'jsonwebtoken'

const generateAccessToken = (userId, res) => {
    const token = jwt.sign({userId},process.env.JWT_KEY,{expiresIn:"30s"})

    res.cookie('jwt',token,{httpOnly: true, maxAge: 24*60*60*1000, secure: true, sameSite: "strict"}) // 1day maxAge
};


const generateRefreshToken = (userId) => {
    const token = jwt.sign({userId},process.env.JWT_KEY,{expiresIn:"5h"})
    return token
};


export{generateAccessToken,generateRefreshToken}