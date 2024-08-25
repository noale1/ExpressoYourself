const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Order routes
router.post('/orders', orderController.create_order);

module.exports = router;
