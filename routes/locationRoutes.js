// routes/locationRoutes.js
const express = require('express');
const Location = require('../models/Location');
const router = express.Router();

// Serve the map page
router.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/locations.html')); // Serve the static HTML file
});

// Fetch locations from MongoDB
router.get('/locations', async (req, res) => {
    try {
        const locations = await Location.find({});
        res.json(locations);
    } catch (error) {
        console.error('Error fetching locations from MongoDB:', error);
        res.status(500).send('Error fetching locations');
    }
});

router.get('/api/key', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

module.exports = router;
