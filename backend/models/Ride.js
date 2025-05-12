import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema({
    driver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    origin: String,
    destination: String,
    timeLeaving: Date,
    capacity: Number,
    notes: String,
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

});

export default mongoose.model('Ride', RideSchema);