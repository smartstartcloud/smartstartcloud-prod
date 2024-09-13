import express from "express"
import { loginUser, signupUser, logoutUser, renewPassword } from "../controllers/auth.controller.js"


const router = express.Router();

router.post("/signup", signupUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/renew", renewPassword)
export default router;