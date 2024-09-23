import express from "express"
import {newAssignment} from '../controllers/module.controller.js'
const router = express.Router();

router.post("/newAssignment",newAssignment);

export default router;