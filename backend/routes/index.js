import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import rideRoutes from './rideRoutes.js'

dotenv.config();

const router = express.Router();

router.use('/rides', rideRoutes);

router.get('/', (req, res) => {
  res.send("Hello World! This is the API, which will be for the frontend to communicate with the backend.");
});

// Export the router using ES module syntax
export default router;