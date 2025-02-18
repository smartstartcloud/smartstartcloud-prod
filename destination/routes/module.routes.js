import express from "express"
import {getAssignment, getModuleAssignmentData, getModuleData} from '../controllers/module.controller.js'
const router = express.Router();
import {authenticate} from '../middlewares/protect.js'
import { deleteAssignment, newAssignmentManual, updateAssignment } from "../controllers/assignment.controller.js";
import { getPaymentDetails, getPaymentDetailsAll, updatePaymentDetails, updatePaymentStatus } from "../controllers/payment.controller.js";

router.use(authenticate);
router.post("/newAssignment",newAssignmentManual);
router.put("/updateAssignment/:assignmentID", updateAssignment);
router.get("/getAssignment/:moduleID/:studentID",getAssignment);
router.get("/getModuleData/:degreeID/:moduleID", getModuleData);
router.get("/getPaymentData/all", getPaymentDetailsAll);
router.post("/getPaymentData", getPaymentDetails);
router.get("/getModuleAssignmentData/:studentID/:moduleID", getModuleAssignmentData);
router.post("/updatePaymentData", updatePaymentDetails);
router.post("/updatePaymentStatus", updatePaymentStatus);
router.delete('/deleteAssignment/:assignmentID', deleteAssignment)

export default router;