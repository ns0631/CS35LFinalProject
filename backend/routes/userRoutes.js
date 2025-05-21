import express from 'express';
import { userLogin, userSignUp} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', userSignUp);
router.post('/login', userLogin);

export default router;