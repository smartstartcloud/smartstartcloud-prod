import express from "express"
import {newDegree,getDegree, getSelectedDegree, getSingleDegree} from '../controllers/degree.controller.js'

const router = express.Router();

router.post("/new",newDegree);

router.get('/all',getDegree) ;

router.get('/selected/year/:degreeYear',getSelectedDegree) ;

router.get('/selected/id/:degreeID',getSingleDegree) ;


export default router;