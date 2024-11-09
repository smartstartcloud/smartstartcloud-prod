import express from "express"
import {newAssignment,getAssignment} from '../controllers/module.controller.js'
const router = express.Router();
import {authenticate} from '../middlewares/protect.js'
import { updateAssignment } from "../controllers/assignment.controllers.js";

router.use(authenticate);
router.post("/newAssignment",newAssignment);
router.put("/updateAssignment/:assignmentID", updateAssignment);
router.get("/getAssignment/:moduleID/:studentID",getAssignment);

export default router;