require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const Product = require('./models/product.js');
const Location = require('./models/location.js');

// Middleware
app.use(express.json());

// Serve static files from the "views" directory
app.use(express.static(path.join(__dirname, 'views')));

// Connect to mongo
const mongoAtlasUri = process.env.MONGO_ATLAS_URI;
mongoose.connect(mongoAtlasUri)
    .then(() => console.log('Connected!'))
    .catch(e => console.log(e));

// Handle routes
const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const supplierRoutes = require('./routes/supplierRoutes.js');

app.use('/', userRoutes);
app.use('/products', productRoutes);
app.use('/supplier', supplierRoutes);

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        console.log('Products fetched:', products);
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages', 'products.html'));
});

app.get('/api/locations', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Unable to fetch locations' });
    }
});

app.use(express.static('public'));


// Start the server
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});