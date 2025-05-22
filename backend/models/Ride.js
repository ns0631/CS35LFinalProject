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

// Static method to find a ride by its ID
RideSchema.statics.findByRideId = async function (rideId) {
    return await this.findById(rideId).populate('driver passengers');
};

export default mongoose.model('Ride', RideSchema);