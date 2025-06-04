import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    createdAt:{
        type: Date,
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

    phone: String,

    ratings: {
        driver: [Number],
        passenger: [Number]
    }

});

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    try{
        console.log('[UserSchema] Hashing password for', this.email);
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('[UserSchema] Password hashed:', this.password.slice(0, 10) + '...');
        next();
    }
    catch(err){
        console.error('[UserSchema] Password hashing error:', err);
        next(err);
    }
});




export default mongoose.model('User', UserSchema);
