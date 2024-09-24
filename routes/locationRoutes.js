// routes/locationRoutes.js
const express = require('express');
const Location = require('../models/Location');
const router = express.Router();
const path = require('path');

// Serve the map page
router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../views/pages', 'locations.html')) });

// Fetch locations from MongoDB
router.get('/markers', async (req, res) => {
    try {
        const locations = await Location.find({});
        res.json(locations);
    } catch (error) {
        console.error('Error fetching locations from MongoDB:', error);
        res.status(500).send('Error fetching locations');
    }
});

router.get('/key', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

module.exports = router;
