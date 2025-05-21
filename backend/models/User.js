import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    passwdsalt: {type: String, required: true},
    avgrating: {type: Number, required: false}
});

export default mongoose.model('User', UserSchema);