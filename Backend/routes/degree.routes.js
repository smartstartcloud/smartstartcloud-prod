import express from "express"
import {newDegree} from '../controllers/degree.controller.js'
import Degree from '../models/degree.models.js';

const router = express.Router();

router.post("/new", newDegree)

// GET route to fetch all degrees
router.get('/degrees', async (req, res) => {
    try {
      const degrees = await Degree.find({});
      res.status(200).json(degrees);
    } catch (error) {
      console.error("Error fetching degrees:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default router;