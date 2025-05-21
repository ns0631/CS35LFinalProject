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

// Static method to find a ride by its ID
RideSchema.statics.findByRideId = async function (rideId) {
    return await this.findById(rideId).populate('driver passengers');
};

export default mongoose.model('Ride', RideSchema);