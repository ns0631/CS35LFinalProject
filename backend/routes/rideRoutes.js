import express from 'express';
import jwt from 'jsonwebtoken';
import { createRide, getAllRides, getRideById, joinRide, deleteRideById, getRidesAfterDate } from '../controllers/rideController.js';

function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
    if(token == null){
        console.log("JWT missing");
        return res.status(403).json({message: "JWT missing", sucesss: false});
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {  
      if (err){
        console.log("Bad JWT");
        console.log(err);
        return res.status(401).json({message: "Bad JWT", sucesss: false});
      }
  
      req.user = user;
      next();
    })
}

const router = express.Router();

router.post('/create', authenticateToken, createRide);
router.post('/getRides', getRidesAfterDate);
router.get('/', getAllRides);
router.get('/:id', getRideById);
router.patch('/:id/join', joinRide);
router.delete('/:id', deleteRideById);

export default router;