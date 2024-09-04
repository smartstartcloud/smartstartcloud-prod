import express from 'express'
const app = express.Router()
import bcrypt from 'bcryptjs'
import User from '../models/user.models.js'
import jwt from 'jsonwebtoken'


function createToken(username){
    return jwt.sign({username},process.env.JWT_KEY,{expiresIn:5*60*1000}); //in minute
}

app.get("/",async (req,res)=>{
    /*
    // check if there is a msg query
    let bad_auth = req.query.msg ? true : false;

    // if there exists, send the error.
    if (bad_auth) {
        return res.render("login", {
        error: "Invalid username or password",
        });
    } else {
        // else just render the login
        return res.render("login");
    }*/
        return res.render("login");
})

app.post('/',async(req,res)=>{
    try {
    const user = await User.findOne({ userName: req.body.username }); 
    if (user) {
        await bcrypt.compare( req.body.password, user.password, function(err, result) {
            if (result) {
                const token = createToken(user.userName);
                res.cookie('jwt',token,{httpOnly: true, maxAge:5*60*1000, secure:true}); //in minute
                res.sendStatus(200);
                //Testing UI code
                //res.render('dashboard',{name: user.userName}) 
                } else {
                    //return res.redirect("/login?msg=fail");
                    return res.status(400).json({error: "Invalid Username or Password"});
                }
        });
    } else {
        //return res.redirect("/login?msg=fail");
        return res.status(400).json({error: "Invalid Username or Password"});
    }
    } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
    }
})
export default app;
