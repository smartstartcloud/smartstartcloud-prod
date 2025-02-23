import User from "../models/user.models.js";
import bcrypt from "bcryptjs"
import {generateAccessToken, generateRefreshToken} from "../utils/generateToken.js";
import { createLog } from "./log.controller.js";

export const loginUser = async (req, res) => {
    try {
        const {userName, password} = req.body;
        const user = await User.findOne({userName});
        
        // First check if the user exists
        if (!user) {
            return res.status(400).json({error: "Invalid Username or Password"});
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({error: "Invalid Username or Password"});
        }

        // Check if the password needs renewal
        if (user.passRenew == false) {
            return res.status(401).json({error: "Default password not changed", userName: user.userName});
        }
        
        generateRefreshToken(user._id,user.role,res)
        

        res.status(200).json({
            _id: user.id,
            userName: user.userName,
            role: user.role,
            name: user.firstName+" "+user.lastName,
            accessToken:generateAccessToken(user._id,user.role)
        })

    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({error: "Internal server error."});
    }
}


export const signupUser = async (req, res) => {
    try {
        const {email, firstName, lastName, userName, password, gender, role} = req.body;
        // Check if the role is valid
        const validRoles = ["superAdmin", "admin", "agent", "finance", "edu", "pen"];
        if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role specified" });
        }
        const userEmail = await User.findOne({email});
        if (userEmail){            
            return res.status(400).json({error: "Email already exists."})
        }
        const user = await User.findOne({userName});
        if (user){            
            return res.status(400).json({error: "Username already exists."})
        }
        let passRenew;
        if(password==process.env.AGENTPASSWORD){
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
            lastName : lastName ? lastName : "",
            userName,
            gender,
            role,
            password: hashPassword,
            passRenew: passRenew
        })

        await newUser.save();

        // Construct a human-readable log message
        const logMessage = `User ${newUser.userName} with email ${
          newUser.email
        } was signed up at ${new Date().toISOString()}.`;
        // Create the log entry (the acting user will be extracted from req.headers.authorization)
        await createLog({
          req,
          collection: "User",
          action: "signup",
          logMessage,
          affectedID: newUser._id,
        });

        res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
          userName: newUser.userName,
          role: newUser.role,
        });
    } catch (error) {
        console.log("Error in sign up controller", error);
        
        res.status(500).json({error: "Internal server error"})
    }
    
}

export const logoutUser = async (req, res) => {
    try {
        res.cookie("refreshToken", "", {maxAge: 0})
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
            generateRefreshToken(user._id,user.role,res)
            res.status(200).json({
                _id: user.id,
                userName: user.userName,
                role: user.role,
                name: user.firstName+" "+user.lastName,
                accessToken:generateAccessToken(user._id,user.role)
            })
        }else{
            res.status(400).json({value:"Password update failed"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server error"});
    }
    
}

export const deleteUser = async (req, res) => {
  try {
    // Extract the user ID to delete from the URL parameters
    const { userId } = req.params;

    // Attempt to delete the user from the database
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Construct a descriptive log message
    const logMessage = `User ${
      deletedUser.userName
    } (ID: ${userId}) was deleted at ${new Date().toISOString()}.`;

    // Create the log entry (the acting user's ID is extracted within createLog)
    await createLog({
      req,
      collection: "User",
      action: "delete",
      logMessage,
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};