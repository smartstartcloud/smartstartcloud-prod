import jwt from 'jsonwebtoken'

const generateToken = (userId, res) => {
    const token = jwt.sign({userId},process.env.JWT_KEY,{expiresIn:"1d"})

    res.cookie('jwt',token,{httpOnly: true, maxAge: 24*60*60*1000, secure: true, sameSite: "strict"}) // 1day maxAge
};

export default generateToken;