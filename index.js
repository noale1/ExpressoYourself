require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/product.js');

const app = express();
// Middleware
app.use(express.json());

// Serve static files from the "views" directory
app.use(express.static(path.join(__dirname, 'views')));

app.get('/controllers/currencyController.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'controllers', 'currencyController.js'));
});

app.get('/models/currency.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'models', 'currency.js'));
});

// Connect to mongo
const mongoAtlasUri = process.env.MONGO_ATLAS_URI;
mongoose.connect(mongoAtlasUri)
    .then(() => console.log('Connected!'))
    .catch(e => console.log(e));

const routes = require('./routes');
app.use('/', routes);
    // Handle routes

// Start the server
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});