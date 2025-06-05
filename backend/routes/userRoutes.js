import express from 'express';
import { createUser, deleteUser, verifyUser, updateUser, getUserById, rateUser } from '../controllers/userController.js';
import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
    console.log('--- Incoming request to protected user endpoint ---');
    console.log('Request path:', req.path);
    const token = req.headers.authorization;
    console.log(token);
    if(token == null){
        console.log("JWT missing");
        return res.status(403).json({message: "JWT missing", success: false});
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {  
      if (err){
        console.log("Bad JWT");
        console.log(err);
        return res.status(401).json({message: "Bad JWT", success: false});
      }
      console.log("JWT successful");
      req.user = user;
      console.log(req.user);
      next();
    });
}

const router = express.Router();
router.put('/signup', createUser);
router.delete('/deleteaccount', deleteUser);
router.post('/login', verifyUser);
router.post('/editprofile', authenticateToken, updateUser);

// Rating endpoints
router.get('/:id', getUserById);
router.post('/:id/rate', authenticateToken, rateUser);

export default router;