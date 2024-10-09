const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const locationController = require('../../controllers/locationController');
const orderController = require('../../controllers/orderController');

router.get('/getProducts', productController.get_products);
router.get('/getCategories', productController.get_categories);

router.get('/getMapsAPIKey', locationController.getApiKey);
router.get('/getMarkers',locationController.getLocations);

router.get('/getExchangeAPIKey', orderController.getExchangeAPIKey);

module.exports = router;