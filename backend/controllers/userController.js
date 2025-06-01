import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

process.env.SECRET_KEY = crypto.randomBytes(256).toString('hex');

function generateAccessToken(username) {
    return jwt.sign(username, process.env.SECRET_KEY, { expiresIn: '900s' });
}

export const createUser = async (req, res) => {
    try {
        console.log(req.body);
        let email = req.body.email;
        const query = User.findOne({ 'email': email });
        var available = true;
        await query.then(async (output) => {
            console.log(output);
            if (output === null) {
                let userData = req.body;
                userData.createdAt = new Date();
                const user = new User(userData);
                await user.save();
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
        const token = req.cookies.jwt;
        if (token == null){
            console.log("JWT missing");
            return res.status(403).json({message: "JWT missing", success: false});
        } else{
            jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
                if (err){
                    console.log("Error: " + err);
                    return res.status(401).json({message: 'Authentication failed', success: false});
                }
            });
        }


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
        return res.status(200).json({message: 'Info updated', success: true, data: user});
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const verifyUser = async (req, res) => {
    console.log(req.body);
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

                res.cookie("jwt", token, {
                    httpOnly: true,
                    expires: dayjs().add(30, "minutes").toDate()
                });

                res.status(200).json({success: true, message: "User authenticated", token: token, data: user});
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