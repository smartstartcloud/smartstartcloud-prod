import express from "express"
import {newAssignment,getAssignment} from '../controllers/module.controller.js'
const router = express.Router();
import {authenticate} from '../middlewares/protect.js'

router.use(authenticate);
router.post("/newAssignment",newAssignment);
router.get("/getAssignment/:moduleID/:studentID",getAssignment);

export default router;