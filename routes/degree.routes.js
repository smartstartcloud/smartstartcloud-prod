import express from "express"
import {newDegree,getAllDegree, getDegreeByYear, getDegreeByID, getDegreeByAgent, getStudentByID, deleteDegree, deleteStudentFromDegree, updateDegree} from '../controllers/degree.controller.js'
import { getAgentList } from "../controllers/auth.controller.js"
import {authenticate,adminAllowed} from '../middlewares/protect.js'
import { addStudentInDegree, getAllStudents } from "../controllers/student.controller.js"


const router = express.Router();

router.use(authenticate);

router.get('/agentlist',getAgentList) ;
router.post("/new",newDegree);
router.put("/updateDegree/:degree_id", updateDegree);

router.get('/all',getAllDegree) ;
router.get('/selected/year/:degreeYear',getDegreeByYear) ;
router.get('/selected/degreeID/:degreeID',getDegreeByID) ;
router.get('/selected/agentID/:degreeAgent',getDegreeByAgent) ;
router.get("/student/all", getAllStudents);
router.get('/selected/studentID/:studentID',getStudentByID) ;
router.post('/addStudentInDegree',addStudentInDegree) ;

router.delete('/deleteDegree/:degreeID',deleteDegree);
router.delete('/deleteStudent/:studentID/:degreeID',deleteStudentFromDegree);
export default router;