import express from "express"
import {getAssignment, getModuleAssignmentData, getModuleData} from '../controllers/module.controller.js'
const router = express.Router();
import {authenticate} from '../middlewares/protect.js'
import { deleteAssignment, linkAssignmentOrderID, newAssignmentManual, updateAssignment } from "../controllers/assignment.controller.js";
import { getPaymentDetails, getPaymentDetailsAll, updatePaymentDetails, updatePaymentStatus, deletePaymentDetails } from "../controllers/payment.controller.js";

router.use(authenticate);

router.get("/getModuleData/:degreeID/:moduleID", getModuleData);
router.get("/getModuleAssignmentData/:studentID/:moduleID", getModuleAssignmentData);

router.post("/newAssignment",newAssignmentManual);
router.put("/updateAssignment/:assignmentID", updateAssignment);
router.get("/getAssignment/:moduleID/:studentID",getAssignment);
router.delete('/deleteAssignment/:assignmentID', deleteAssignment)

router.get("/getPaymentData/all", getPaymentDetailsAll);
router.post("/getPaymentData", getPaymentDetails);
router.put("/updatePaymentData", updatePaymentDetails);
router.put("/updatePaymentStatus", updatePaymentStatus);
router.delete("/deletePayment/:paymentID", deletePaymentDetails);

router.post("/linkAssignmentOrderID", linkAssignmentOrderID);

export default router;