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

    ratings: [{
        rater: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        value: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    }],

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




UserSchema.methods.getAverageRating = function() {
    if (!this.ratings || this.ratings.length === 0) return null;
    const sum = this.ratings.reduce((acc, curr) => acc + curr.value, 0);
    return (sum / this.ratings.length).toFixed(2);
};

export default mongoose.model('User', UserSchema);
