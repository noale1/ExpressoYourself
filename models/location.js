const mongoose = require('mongoose');

// Define the Location schema
const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
});

// Create the Location model
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;