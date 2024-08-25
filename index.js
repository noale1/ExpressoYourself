const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Connect to mongo
mongoose.connect('mongodb://localhost:27017/expresso-yourself')
    .then(() => console.log('Connected!'))
    .catch(e => console.log(e));

// Handle routes
const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const supplierRoutes = require('./routes/supplierRoutes.js');

app.use('/',userRoutes);
app.use('/products', productRoutes);
app.use('/supplier',supplierRoutes);

// Start the server
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});