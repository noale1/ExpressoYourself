const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const locationController = require('../../controllers/locationController');

router.get('/getProducts', productController.get_products);

router.get('/getMapsAPIKey', locationController.getApiKey);

module.exports = router;
// app.get('/api/locations', async (req, res) => {
//     try {
//         const locations = await Location.find();
//         res.json(locations);
//     } catch (error) {
//         res.status(500).json({ error: 'Unable to fetch locations' });
//     }
// });