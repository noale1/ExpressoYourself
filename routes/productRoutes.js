const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Product routes
router.get('/test', (req, res) => res.json("this is first route"))
// router.get('/products', productController.list_products); 
router.post('/admin/products', productController.add_product);
router.delete('/admin/products/:id', productController.delete_product);
router.post('/admin/products/:id', productController.update_product);

module.exports = router;
