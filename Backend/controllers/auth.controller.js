import User from "../models/user.models.js";
import bcrypt from "bcryptjs"
import {generateAccessToken, generateRefreshToken} from "../utils/generateToken.js";

export const loginUser = async (req, res) => {
    try {
        const {userName, password} = req.body;
        const user = await User.findOne({userName})
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid Username or Password"})
        }
        if(user.passRenew==false){
            return res.status(401).json({error: "Default password not changed",useName:user.userName});
        }
        
        generateRefreshToken(user._id, res)
        

        res.status(200).json({
            _id: user.id,
            userName: user.userName,
            accessToken:generateAccessToken(user._id)
        })

    } catch (error) {
        console.log("Error in login controller", error);
        
        res.status(400).json({error: "Internal server error."});
    }

    
}

export const signupUser = async (req, res) => {
    try {
        const {email, firstName, lastName, userName, password, gender} = req.body;
        const userEmail = await User.findOne({email});
        if (userEmail){            
            return res.status(400).json({error: "Email already exists."})
        }
        const user = await User.findOne({userName});
        if (user){            
            return res.status(400).json({error: "Username already exists."})
        }
        let passRenew;
        if(password=='000000'){
            passRenew = false;
        }
        else{
            passRenew = true;
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)
        // Create User
        const newUser = new User({
            email,
            firstName,
            lastName,
            userName,
            gender,
            password: hashPassword,
            passRenew: passRenew
        })

        if(newUser){
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                userName: newUser.userName,
            })
        }


    } catch (error) {
        console.log("Error in sign up controller", error);
        
        res.status(500).json({error: "Internal server error"})
    }
    
}

export const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.log("Error in sign up controller", error);
        
        res.status(500).json({error: "Internal server error"})
    }
    
}

export const renewPassword = async (req, res) => {
    try {
        const {userName, password} = req.body;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)

        const user = await User.findOneAndUpdate({userName},{$set: { password: hashPassword,passRenew:true }});
        if(user){
            res.status(200).json({value:"Password updated"});
        }else{
            res.status(400).json({value:"Password update failed"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server error"});
    }
    
}