import Ride from '../models/Ride.js';
import User from '../models/User.js';

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

export const getAllRides = async (req, res) => {
    try{
        const rides = await Ride.find();
        res.status(200).json(rides);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

export const getRideById = async (req, res) => {
    try{
        const ride = await Ride.findById(req.params.id).populate('driver passengers');
        if(!ride) return res.status(404).json({message: "Ride not found"});
        res.json(ride);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

export const joinRide = async (req, res) => {
    try {
        if (!req.body.userId) {
            return res.status(400).json({ message: 'Missing userId in request body' });
        }
        const ride = await Ride.findById(req.params.id).populate('driver passengers');
        if(!ride){
            return res.status(404).json({message: 'Ride not found'});
        }
        if(ride.passengers.includes(req.body.userId)) {
            return res.status(400).json({message: 'User already joined this ride'});
        }

        if(ride.passengers.length >= ride.capacity) {
            return res.status(400).json({message: 'Ride is full'});
        }
        
        ride.passengers.push(req.body.userId);
        await ride.save();
        res.status(200).json({message: 'User added to ride', ride});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

export const deleteRideById = async(req, res) => {
    try{
        const ride = await Ride.findById(req.params.id);
        if(!ride){
            return res.status(404).json("Ride not found");
        }
        res.status(200).json({message: 'Ride deleted succesfully', ride});
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};