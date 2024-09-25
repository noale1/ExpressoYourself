const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const locationController = require('../../controllers/locationController');
const orderController = require('../../controllers/orderController');

router.get('/getProducts', productController.get_products);

router.get('/getMapsAPIKey', locationController.getApiKey);
router.get('/locations',locationController.getLocations);

router.post('/order',orderController.checkout);

router.get('/cart/:user',orderController.getUserCart)

module.exports = router;