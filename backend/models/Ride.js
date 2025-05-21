import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema({
    driver: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    origin: {type: String, required: true},
    destination: {type: String, required: true},
    timeLeaving: {type: Date, required: true},
    capacity: {type: String, required: false},
    notes: {type: String, required: false},
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

});

export default mongoose.model('Ride', RideSchema);