const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');


router.get('/products', productController.get_products);


module.exports = router;
// app.get('/api/locations', async (req, res) => {
//     try {
//         const locations = await Location.find();
//         res.json(locations);
//     } catch (error) {
//         res.status(500).json({ error: 'Unable to fetch locations' });
//     }
// });