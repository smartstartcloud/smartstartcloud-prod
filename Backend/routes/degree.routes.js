import express from "express"
import {newDegree,getDegree} from '../controllers/degree.controller.js'

const router = express.Router();

router.post("/new",newDegree);

router.get('/all',getDegree) ;

export default router;