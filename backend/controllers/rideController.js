import Ride from '../models/Ride.js';

export const createRide = async (req, res) => {
    try {
        const ride = new Ride(req.body);
        await ride.save();
        res.status(201).json(ride);
    }
    catch (err){
        res.status(400).json({ message : err.message});
    }
};