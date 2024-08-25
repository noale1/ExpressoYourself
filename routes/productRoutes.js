const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const path = require('path');

router.post('/admin/products', productController.add_product);
router.delete('/admin/products/:id', productController.delete_product);
router.post('/admin/products/:id', productController.update_product);

module.exports = router;
