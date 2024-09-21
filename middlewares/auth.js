const jwt = require('jsonwebtoken'); // If using JWT
const User = require('../models/user');


// Middleware function to check authentication
exports.authenticateToken = async (req, res, next) => {
    const token = req.headers['cookie']?.split('=')[1];
    if (!token) return res.redirect(302, '/login'); // No token, unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.redirect(302, '/login'); // Token is invalid
        req.user = user; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    });
}


