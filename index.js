require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/product.js');
const uploadController = require('./controllers/uploadController');

const app = express();
// Middleware
app.use(express.json());

uploadController.delete_unused_files();

// Serve static files from the "views" directory
app.use(express.static(path.join(__dirname, 'views')));


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