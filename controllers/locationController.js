const Location = require('../models/Location');

// Controller function to handle the Google Maps API key request
exports.getApiKey = (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Google Maps API key is missing' });
    }
    res.json({ apiKey });
};


// Controller function to provide location data from MongoDB
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find(); // Fetch all locations from MongoDB
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching locations' });
    }
};
