import express from "express"
import {authenticate} from '../middlewares/protect.js'
import { fetchNewNotification, sendNotification } from "../controllers/notification.controller.js";

const router = express.Router();
router.use(authenticate);
router.post("/sendNotification", sendNotification)
router.post("/FetchNewNotification", fetchNewNotification)
export default router;