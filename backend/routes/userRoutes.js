import express from 'express';
import { createUser, deleteUser, verifyUser } from '../controllers/userController.js';

const router = express.Router();
router.post('/signup', createUser);
router.post('/deleteaccount', deleteUser);
router.post('/login', verifyUser);

export default router;