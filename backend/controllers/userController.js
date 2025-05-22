import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dayjs from 'dayjs';

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
            console.log(output);
            if (output === null) {
                const user = new User(req.body);
                await user.save();
                res.status(201).json(user);
            } else {
                res.status(403).json("Username unavailable");
            }
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status.json({ message: 'Invalid Password' });
        }


        const token = generateAccessToken({ username: email });

        res.cookie("jwt", token, {
            httpOnly: true,
            expires: dayjs().add(30, "minutes").toDate()
        });
        res.json({ outcome: "correct", token: token });


    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        let email = req.body.email;
        let passwd = req.body.passwdsalt;
        const query = User.findOneAndDelete({ 'email': email, 'passwdsalt': passwd });
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