const jwt = require('jsonwebtoken'); // If using JWT

// Middleware function to check authentication
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401); // No token, unauthorized

    jwt.verify(token, 'SUPER_SECRET_KEY', (err, user) => {
        if (err) return res.sendStatus(403); // Token is invalid
        req.user = user; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    });
}


