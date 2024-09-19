const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//TODO: crud for user
//TODO: hash password in the create function
//TODO: validate jwt
//TODO: make jwt secret in the .env
//TODO: validate admin
//TODO: enforce auth


//list all Users
exports.listAll = async (req, res) => {
    try {
        const users = await User.find();
        const successMessage = req.query.message;
        res.json({ users, successMessage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Register new user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    try{
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.redirect(302, '/login');
    }catch (error){
        console.log(error.message);
        if (error.code === 11000) { // MongoDB duplicate key error code
            const field = Object.keys(error.keyValue)[0]; // Get the field that caused the duplication
            return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` });
        }
        return res.status(500).json({ message: 'Parameter Error!' });
    }
};

// Delete a user by username
exports.delete = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    };
};

// Login 
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentails!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
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




