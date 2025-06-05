import express from 'express';
import jwt from 'jsonwebtoken';
import { createRide, getAllRides, getRideById, joinRide, deleteRideById, getRidesAfterDate, getMyRides } from '../controllers/rideController.js';

function authenticateToken(req, res, next) {
    console.log('--- Incoming request to protected ride endpoint ---');
    console.log('Request path:', req.path);
    console.log('Headers:', req.headers);
    const token = req.headers.authorization;
    if(token == null){
        console.log("JWT missing");
        return res.status(403).json({message: "JWT missing", sucesss: false});
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {  
      if (err){
        console.log("Bad JWT");
        console.log(err);
        return res.status(401).json({message: "Bad JWT", success: false});
      }
      req.user = user;
      next();
    })
}

const router = express.Router();

router.post('/create', authenticateToken, createRide);
router.post('/getRides', authenticateToken, getRidesAfterDate);
router.get('/myrides', authenticateToken, getMyRides);
router.get('/', getAllRides);
// IMPORTANT: /myrides must be above /:id to prevent ObjectId cast errors
router.get('/:id', getRideById);
router.patch('/:id/join', authenticateToken, joinRide);
router.delete('/:id', deleteRideById);

export default router;