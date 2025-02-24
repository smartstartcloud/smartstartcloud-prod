import express from 'express';
import { authenticate } from '../middlewares/protect.js';
import { globalSearch } from '../controllers/globalSearch.controller.js';

const router = express.Router();

router.use(authenticate);
// Route to fetch logs (admin access only)
router.get("/", globalSearch);

export default router;