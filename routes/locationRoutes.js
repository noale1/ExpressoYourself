const express = require('express');
const locationController = require('../controllers/locationController');
const router = express.Router();

// Route to get the Google Maps API key
router.get('/api/key', locationController.getApiKey);

// Route to get location data
router.get('/locations', locationController.getLocations);

module.exports = router;
