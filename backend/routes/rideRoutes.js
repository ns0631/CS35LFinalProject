import express from 'express';
import { createRide } from '../controllers/rideController.js';

const router = express.Router();
router.post('/create', createRide);

export default router;