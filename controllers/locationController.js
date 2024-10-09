const Location = require('../models/location');

// Google Maps API request
exports.getApiKey = (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Google Maps API key is missing' });
    }
    return res.json({ apiKey });
};


// Location data from DB
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find(); 
        return res.json(locations);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching locations' });
    }
};