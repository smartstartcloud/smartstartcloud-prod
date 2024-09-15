import express from "express"
import {newDegree} from '../controllers/degree.controller.js'

const router = express.Router();

router.post("/new", newDegree)

export default router;