import express from "express"
import {newDegree,getAllDegree, getDegreeByYear, getDegreeByID, getDegreeByAgent} from '../controllers/degree.controller.js'
import { getAgentList } from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/new",newDegree);
router.get('/all',getAllDegree) ;
router.get('/selected/year/:degreeYear',getDegreeByYear) ;
router.get('/selected/id/:degreeID',getDegreeByID) ;
router.get('/selected/id/:degreeAgent',getDegreeByAgent) ;
router.get('/agentlist',getAgentList) ;

export default router;