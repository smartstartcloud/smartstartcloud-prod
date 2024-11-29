import express from "express"
import {getAssignment, getModuleData} from '../controllers/module.controller.js'
const router = express.Router();
import {authenticate} from '../middlewares/protect.js'
import { deleteAssignment, newAssignmentManual, updateAssignment } from "../controllers/assignment.controller.js";

router.use(authenticate);
router.post("/newAssignment",newAssignmentManual);
router.put("/updateAssignment/:assignmentID", updateAssignment);
router.get("/getAssignment/:moduleID/:studentID",getAssignment);
router.get("/getModuleData/:degreeID/:moduleID", getModuleData);
router.delete('/deleteAssignment/:assignmentID', deleteAssignment)

export default router;