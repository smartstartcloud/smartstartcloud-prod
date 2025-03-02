import express from 'express';
import { deleteLog, getAllLogs } from "../controllers/log.controller.js";
import { adminAllowed, authenticate } from '../middlewares/protect.js';

const router = express.Router();

router.use(authenticate, adminAllowed);
// Route to fetch logs (admin access only)
router.get("/AllLogs", getAllLogs);
// DELETE log by ID
router.delete("/deleteLog/:id", deleteLog);

export default router;
