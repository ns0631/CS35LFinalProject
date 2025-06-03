import express from 'express';
import { createUser, deleteUser, verifyUser, updateUser } from '../controllers/userController.js';
import jwt from 'jsonwebtoken';

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
router.put('/signup', createUser);
router.delete('/deleteaccount', deleteUser);
router.post('/login', verifyUser);
router.post('/editprofile', authenticateToken, updateUser);

export default router;