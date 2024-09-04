import User from "../models/user.models.js";
import bcrypt from "bcryptjs"

export const loginUser = (req, res) => {
    console.log("login User");
    
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
            return res.status(400).json({error: "User Name already exists."})
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
            password: hashPassword
        })

        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            userName: newUser.userName,
        })

    } catch (error) {
        console.log("Error in sign up controller", error);
        
        res.status(500).json({error: "Internal server error"})
    }
    
}

export const logoutUser = (req, res) => {
    console.log("logout User");
    
}