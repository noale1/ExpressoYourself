const express = require('express');
const router = express.Router();
const supplierController = require('../../controllers/supplierController');
const path = require('path');
const auth = require('../../middlewares/auth_midware');
const supplierMidWare = require('../../middlewares/supplier_midware');
const orderController = require('../../controllers/orderController');
const RELATIVE_PAGES_PATH = '../../views/pages';


router.use( auth.authenticateToken )
router.use( supplierMidWare.isSupplier  );



// supplier ROUTES
// router.get('/supplier', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'order.html')) });
// router.post('/suplier',orderController.checkout);

module.exports = router;