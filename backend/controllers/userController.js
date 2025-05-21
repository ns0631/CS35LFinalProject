import User from '../models/User.js';


export const userSignUp = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    }
    catch (err){
        res.status(400).json({ message : err.message });
    }
};

export const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({ message: 'User not found'});
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status.json({ message: 'Invalid Password' });
        }

        res.status(200).json({
            message: 'Login succesful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                photo: user.photo
            }

        })
    }
    catch (err){
        res.status(500).json({ message : err.message});
    }
};