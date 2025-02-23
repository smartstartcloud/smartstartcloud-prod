import express from 'express';
import { getLogs } from '../controllers/log.controller.js';
import { adminAllowed, authenticate } from '../middlewares/protect.js';

const router = express.Router();

router.use(authenticate, adminAllowed);
// Route to fetch logs (admin access only)
router.get('/logs', getLogs);

export default router;
