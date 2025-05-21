import express from 'express';
import { createRide, getAllRides, getRideById, joinRide, deleteRideById } from '../controllers/rideController.js';

const router = express.Router();

router.post('/create', createRide);
router.get('/', getAllRides);
router.get('/:id', getRideById);
router.patch('/:id/join', joinRide);
router.delete('/:id', deleteRideById);

export default router;