import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type:String,
        required: true
    },

    number: String,

    ratings: {
        driver: [Number],
        passenger: [Number]
    }

});

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch(err){
        next(err);
    }
});




export default mongoose.model('User', UserSchema);
