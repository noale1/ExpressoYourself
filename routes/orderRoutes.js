const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const path = require('path');

// Order routes
router.post('/orders', orderController.create_order);

module.exports = router;
