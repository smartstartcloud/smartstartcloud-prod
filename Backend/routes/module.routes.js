import express from "express"
import {newAssignment,getAssignment,newAssignment} from '../controllers/module.controller.js'
const router = express.Router();
import {authenticate,adminAllowed} from '../middlewares/protect.js'

router.use(authenticate);
router.post("/newAssignment",newAssignment);
router.get("/getAssignment/:moduleID/:studentID",getAssignment);
router.post("/newAssignment", newAssignment);


export default router;