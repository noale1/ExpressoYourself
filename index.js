require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const Product = require('./models/product.js');

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
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const supplierRoutes = require('./routes/supplierRoutes.js');
const locationRoutes = require('./routes/locationRoutes');

app.use('/', authRoutes);
app.use('/api', userRoutes);
app.use('/products', productRoutes);
app.use('/supplier', supplierRoutes);
app.use(locationRoutes);
app.use('/order', orderRoutes);

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

app.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages', 'order.html'));
});

app.use(express.static('public'));


// Start the server
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});