import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

process.env.SECRET_KEY = crypto.randomBytes(256).toString('hex');

function generateAccessToken(username) {
    return jwt.sign(username, process.env.SECRET_KEY, { expiresIn: '900s' });
}

export const createUser = async (req, res) => {
    try {
        let email = req.body.email;
        const query = User.findOne({ 'email': email });
        var available = true;
        await query.then(async (output) => {
            if (output === null) {
                let userData = req.body;
                userData.createdAt = new Date();
                const user = new User(userData);
                await user.save();

                userData = user.toObject();
                delete userData['password'];
                res.status(201).json({message: 'User Created', success: true, data: user});
            } else {
                res.status(403).json({message: 'Username unavailable', success: false});
            }
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        if(!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.phone){
            return res.status(400).json({success: false, message: "Request missing first name, last name, email, or phone"});
        }

        console.log("JWT present");
        let email = req.body.email;
        let user = await User.findOne({ 'email': email });

        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.phone = req.body.phone;
        user.save()

        const token = req.headers.authorization;
        let userData = user.toObject();
        delete userData['password'];
        userData['token'] = token;

        return res.status(200).json({message: 'Info updated', success: true, data: userData});
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        } else{
            console.log(user);
        }

        const isMatch = await bcrypt.compare(password, user.password, function(err, result) {
            if(err){
                console.log(result);
                res.status(500).json({ message: err });
            } 
            if (result){
                const token = generateAccessToken({ username: email });
                
                let userData = user.toObject();
                delete userData['password'];
                userData['token'] = token;

                res.status(200).json({success: true, message: "User authenticated", token: token, data: userData});
            } else{
                res.status(401).json({success: false, message: "Invalid password"});
            }
        });
        return;
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        let email = req.body.email;
        let passwd = req.body.password;
        const query = User.findOneAndDelete({ 'email': email, 'password': passwd });
        await query.then((output) => {
            if (output === null) {
                return res.status(401).json("Failed.");
            }
            return res.status(200).json("Deleted user.");
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};