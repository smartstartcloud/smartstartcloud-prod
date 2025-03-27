import express from "express"
import { loginUser, signupUser, logoutUser, renewPassword, getAgentList, getAllUserList, deleteUser, getUserByUserID, updateUser, forgotPassword, resetPassword } from "../controllers/auth.controller.js"
import {authenticate,adminAllowed} from '../middlewares/protect.js'

const router = express.Router();

router.post("/signup",authenticate,adminAllowed,signupUser)
router.put("/user/update/:userID", updateUser);
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/renew", renewPassword)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get('/agentlist',getAgentList) ;
router.get('/agent/all', getAllUserList);
router.get("/user/:userID", getUserByUserID);

router.delete("/deleteUser/:userID", deleteUser);
export default router;