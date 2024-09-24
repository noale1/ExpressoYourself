const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const path = require('path');
const auth = require('../middlewares/auth_midware');


router.use(auth.authenticateToken);


// Supplier routes
router.post('/supplier', supplierController.create_supplier);

module.exports = router;
