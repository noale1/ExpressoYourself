const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const supplierController = require('../../controllers/supplierController');
const productController = require('../../controllers/productController');
const path = require('path');
const auth = require('../../middlewares/auth_midware');
const admin = require('../../middlewares/admin_midware');

// router.use(auth.authenticateToken);
// router.use(admin.isAdmin);

// Register and login routes
router.get('/getUsers' ,userController.listAllUsers);
router.get('/deleteAllUsers' ,userController.deleteAllUsers);
router.get('/deleteUser' ,userController.deleteUser);
router.get('/grantAdmin' ,userController.addAdmin);
router.get('/revokeAdmin' ,userController.revokeAdmin);


// Supplier routes
router.post('/addSupplier', supplierController.add_supplier);
router.get('/listAllSuppliers', supplierController.list_all_supplier);
router.get('/deleteSupplier', supplierController.delete_supplier);
router.get('/getSupplier', supplierController.get_supplier);


// Product Routes
router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../../views/pages', 'products.html')) });
router.post('/products', productController.add_product);
router.delete('/products/:id', productController.delete_product);
router.post('/products/:id', productController.update_product);

module.exports = router;
