const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isAdmin } = require('../middlewares/admin_midware');
const router = require('../routes/admin/adminRoutes');

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

        const token = jwt.sign({ userId: user._id, username: user.username, isAdmin: user.isAdmin, isSupplier: user.isSupplier }, process.env.JWT_SECRET, {
            expiresIn: '3h', 
        });

        res.cookie('Autherization', token, {
            httpOnly: true, 
            maxAge: 3600000 // 3 hours in milliseconds
        });
        console.log("[+] User Logged In: ",email, user.username,  password);
        res.json({ message: 'Login successful, Welcome '+user.username,  is_admin: user.isAdmin, is_supplier: user.isSupplier});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    console.log("[+] New User Registered: ",email, username,  password);
    try{
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.json({ message: 'Register successful, '+ username + ' Enjoy Our Site'});
    }catch (error){
        console.log(error.message + error.code);
        if (error.code === 11000) { // MongoDB duplicate key error code
            const field = Object.keys(error.keyValue)[0]; // Get the field that caused the duplication
            return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` });
        }

        return res.status(500).json({ message: error.message });
    }
};


exports.logout = async (req, res) => {
    const token = jwt.sign({ userId: "", username:"", isAdmin: "", isSupplier:"" }, process.env.JWT_SECRET, {
        expiresIn: '0h', 
    });
    res.cookie('Autherization', token, {
        httpOnly: true, 
        maxAge: 3600000 // 3 hour in milliseconds
    });
    return res.status(200).send('Logged out successfully');
};
  


exports.getUserFromToken = (token) => {
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET); 
        return user.username; 
    } catch (err) {
        return null; 
    }
};

exports.getUserIdFromToken = (token) => {
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET); 
        return user.userId; 
    } catch (err) {
        return null; 
    }
};

