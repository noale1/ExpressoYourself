const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: String,
    coordinates: {
        lat: Number,
        lng: Number
    }
});


module.exports = mongoose.model('Location', locationSchema);