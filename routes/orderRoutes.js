const express = require('express');
const router = express.Router();
const productController = require('../controllers/orderController');
const path = require('path');

router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../views/pages', 'order.html')) });

module.exports = router;