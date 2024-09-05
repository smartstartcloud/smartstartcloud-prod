import jwt from 'jsonwebtoken'

const generateAccessToken = (userId, res) => {
    const token = jwt.sign({userId},process.env.JWT_KEY,{expiresIn:"1d"})

    res.cookie('jwt',token,{httpOnly: true, maxAge: 24*60*60*1000, secure: true, sameSite: "strict"}) // 1day maxAge
};


const generateRefreshToken = (userId) => {
    const token = jwt.sign({userId},process.env.JWT_KEY,{expiresIn:"2d"})
    return token
};


export{generateAccessToken,generateRefreshToken}