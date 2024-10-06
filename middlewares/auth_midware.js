const jwt = require('jsonwebtoken'); // If using JWT


// Middleware function to check authentication
exports.authenticateToken = async (req, res, next) => {
    try{
        const token = req.headers['cookie']?.split('=')[1];
        if (!token) return res.redirect(302, '/login'); // No token, unauthorized

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.redirect(302, '/login'); // Token is invalid
            req.user = user; // Attach user info to request
            next(); // Proceed to the next middleware or route handler
        });
    }catch (error){
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Access denied.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        }
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

