const express = require('express');
const router = express.Router();
const supplierController = require('../../controllers/supplierController');
const path = require('path');
const auth = require('../../middlewares/auth_midware');
const orderController = require('../../controllers/orderController');
const RELATIVE_PAGES_PATH = '../../views/pages';

router.use( auth.authenticateToken );

const supplierRoutes = require('./supplierRoutes.js');
router.use('/supplier',supplierRoutes);

// order page
router.get('/order', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'order.html')) });
router.post('/order',orderController.checkout);

module.exports = router;
