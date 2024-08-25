const express = require('express');
// const cors = require('cors');
// const config = require('./config/config');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware
// app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to mongo
mongoose.connect('mongodb://localhost:27017/expresso-yourself')
    .then(() => console.log('Connected!'))
    .catch(e => console.log(e));

// Handle routes
const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');

app.use('/products', productRoutes);
app.use(userRoutes);
app.use(productRoutes);
app.use(orderRoutes);

// Start the server
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});