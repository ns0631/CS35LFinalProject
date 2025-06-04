import Ride from '../models/Ride.js';
import User from '../models/User.js';

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

Date.prototype.addMinutes = function(m) {
  this.setTime(this.getTime() + (m*60*1000));
  return this;
}

export const createRide = async (req, res) => {
    console.log('--- createRide called ---');
    console.log('Request user:', req.user);
    console.log('Request body:', req.body);
    try {
        const ride = new Ride(req.body);
        await ride.save();
        res.status(201).json({ message: 'Ride created', success: true, data: ride});
    }
    catch (err){
        res.status(400).json({ message : err.message, success: false});
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

export const getRidesAfterDate = async (req, res) => {
    console.log('--- getRidesAfterDate called ---');
    console.log('Request user:', req.user);
    console.log('Request body:', req.body);
    try{
        // TEMPORARY: Return all rides, ignore time filtering
        // --- Original time filtering code commented out below ---
        /*
        let lowcutoff = new Date(req.body.timeLeaving);
        let highcutoff = new Date(lowcutoff);
        let hourbound = Number(req.body.hourBound);
        let minutebound = Number(req.body.minuteBound);
        highcutoff.addHours(hourbound);
        highcutoff.addMinutes(minutebound);
        const rides = await Ride.find({timeLeaving: {$gte: lowcutoff, $lte: highcutoff}});
        */
        const rides = await Ride.find();
        for(let ride of rides){
            ride.driver = await User.findById(ride.driver);
            let newPassengers = [];
            for(let passenger of ride.passengers){
                newPassengers.push(await User.findById(passenger));
            }
            ride.passengers = newPassengers;
        }
        res.status(200).json({success: true, message: 'Rides found', data: rides});
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
    console.log('--- joinRide called ---');
    console.log('Request user:', req.user);
    console.log('Request body:', req.body);
    try {
        if (!req.body.userId) {
            return res.status(400).json({ success: false, message: 'Missing userId in request body' });
        }
        const ride = await Ride.findById(req.params.id).populate('driver passengers');
        const user = await User.findById(req.body.userId);
        const currentPassengers = ride.passengers.map((passenger) => (passenger._id.toString()));
        if(!ride){
            return res.status(404).json({success: false, message: 'Ride not found'});
        }
        if(currentPassengers.includes(req.body.userId)) {
            return res.status(406).json({success: false, message: 'User already joined this ride'});
        }

        if(ride.passengers.length >= ride.capacity) {
            return res.status(403).json({success: false, message: 'Ride is full'});
        }
        
        ride.passengers.push(user);
        await ride.save();
        return res.status(200).json({success: true, message: 'User added to ride', ride});
    }
    catch(err){
        return res.status(500).json({success: false, message: err.message});
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