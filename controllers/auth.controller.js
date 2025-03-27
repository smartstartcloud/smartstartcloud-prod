import User from "../models/user.models.js";
import bcrypt from "bcryptjs"
import {generateAccessToken, generateRefreshToken} from "../utils/generateToken.js";
import { createLog } from "./log.controller.js";
import crypto from "crypto";

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

        const expiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN, 10);
        generateRefreshToken(user._id,user.role,res, expiresIn)

        res.status(200).json({
            _id: user.id,
            userName: user.userName,
            role: user.role,
            name: user.firstName+" "+user.lastName,
            accessToken:generateAccessToken(user._id,user.role),
            expiresIn : {duration: expiresIn, creationTime: Date.now()}

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

        const homeLink = `/allAgent`;
        const dataId = ''
        // Create User
        const newUser = new User({
            email,
            firstName,
            lastName : lastName ? lastName : "",
            userName,
            gender,
            role,
            password: hashPassword,
            passRenew: passRenew,
            metadata: {goTo: homeLink, dataId: dataId}
        })

        await newUser.save();

        // Construct a human-readable log message
        const logMessage = `User ${newUser.userName} with email ${
          newUser.email
        } was signed up.`;
        // Create the log entry (the acting user will be extracted from req.headers.authorization)
        await createLog({
          req,
          collection: "User",
          action: "signup",
          actionToDisplay: "Sign Up User",
          logMessage,
          affectedID: newUser._id,
          metadata: newUser.metadata,
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

// In user.controller.js
export const updateUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const updateFields = req.body;

    const user = await User.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // ✅ If password update is requested, verify oldPassword first
    if (updateFields.password && updateFields.oldPassword) {
      const isValidOldPassword = await bcrypt.compare(
        updateFields.oldPassword,
        user.password
      );

      if (!isValidOldPassword) {
        return res.status(401).json({ error: "Incorrect old password" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(updateFields.password, salt);
    }

    // Remove oldPassword from the payload to avoid accidental saving
    delete updateFields.oldPassword;

    // Proceed with updating the user
    const updatedUser = await User.findOneAndUpdate(
      { _id: userID },
      { $set: updateFields },
      { new: true }
    ).select("-password");    

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

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
    const { userID } = req.params;
    console.log(userID);
    
    

    // Attempt to delete the user from the database
    const deletedUser = await User.findByIdAndDelete(userID);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Construct a descriptive log message
    const logMessage = `User ${
      deletedUser.userName
    } (ID: ${userID}) was deleted.`;

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

export const getAgentList = async (req, res) => {
  try {
    const user = await User.find(
      { role: "agent" },
      { _id: 1, firstName: 1, lastName: 1 }
    );
    if (!user) {
      res.status(400).json({ error: "Error fetching agent" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllUserList = async (req, res) => {
  try {
    const user = await User.find({ role: { $ne: "superAdmin" } }).select(
      "_id userID firstName lastName email role gender userName"
    );
    if (!user) {
      res.status(400).json({ error: "Error fetching agent" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user by userID (not _id)
export const getUserByUserID = async (req, res) => {
  try {
    const { userID } = req.params;    
    if (!userID) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by userID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email, frontendURL } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🔑 Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 1000 * 60 * 10; // 10 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiry;
    
    await user.save();

    // 📧 Send email with reset link
    const resetUrl = `${frontendURL}/reset-password/${resetToken}`;
    console.log(resetUrl);
    
    // await sendEmail(
    //   user.email,
    //   "Reset Your Password",
    //   `Reset here: ${resetUrl}`
    // );

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  console.log(token, newPassword);
  

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });    

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });

    // 🔐 Hash and update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.passRenew = true;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};