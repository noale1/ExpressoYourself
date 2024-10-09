const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.isAdmin = async (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.headers['cookie']?.split('=')[1];
    if (!token) return res.redirect(302, '/login');

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.redirect(302, '/login'); // Token is invalid
            if(!user.isAdmin) return res.status(403).json({ message: 'Unpriviledged Account' });// Attach user info to request
            next(); 
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Access denied.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        }
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


