import express from 'express';
import { getLogs } from './log.controller.js';
import { authenticate, adminAllowed } from './protect.js'; // Assuming you have these middlewares

const router = express.Router();

// Route to fetch logs (admin access only)
router.get('/logs', authenticate, adminAllowed, getLogs);

export default router;
