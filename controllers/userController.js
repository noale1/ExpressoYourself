const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//TODO: crud for user
//TODO: hash password in the create function
//TODO: validate jwt
//TODO: make jwt secret in the .env
//TODO: validate admin
//TODO: enforce auth


// Register new user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.json({ message: 'User registered successfully' });
};

// Login 
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentails!' });
        }

        //const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = (password === user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credentails!' });
        }

        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, 'SUPER_SECRET_KEY', {
            expiresIn: '3h', // Token expiration
        });

        res.cookie('Autherization', token, {
            httpOnly: true, // Prevents client-side access to the cookie
            maxAge: 10800000 // 3 hour in milliseconds
        });
        res.json({ message: 'Login successful, Welcome '+user.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


