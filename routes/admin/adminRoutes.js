const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const supplierController = require('../../controllers/supplierController');
const productController = require('../../controllers/productController');
const uploadController = require('../../controllers/uploadController');
const path = require('path');
const auth = require('../../middlewares/auth_midware');
const admin = require('../../middlewares/admin_midware');
const RELATIVE_PAGES_PATH = '../../views/pages';

router.use(auth.authenticateToken);
router.use(admin.isAdmin);

// Register and login routes
router.get('/getUsers' ,userController.listAllUsers);
router.get('/deleteAllUsers' ,userController.deleteAllUsers);
router.get('/deleteUser' ,userController.deleteUser);
router.get('/grantAdmin' ,userController.addAdmin);
router.get('/revokeAdmin' ,userController.revokeAdmin);


// Supplier routes
router.post('/addSupplier', supplierController.add_supplier);
router.get('/addSupplier', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'addSupplier.html')) });
router.get('/suplliersManagment', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'suplliersManagment.html')) });
router.get('/listAllSuppliers', supplierController.list_all_supplier);
router.get('/deleteSupplier', supplierController.delete_supplier);
router.get('/getSupplier', supplierController.get_supplier);
router.post('/addProdectToSupplier', supplierController.add_product_to_supplier);

// Product Routes
router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../../views/pages', 'products.html')) });
router.get('/products', (req, res) => { res.sendFile(path.join(__dirname, '../../views/pages', 'adminProducts.html')) });
router.get('/productPage/:id', (req, res) => { res.sendFile(path.join(__dirname, '../../views/pages', 'adminProductPage.html')) });
router.post('/products', productController.add_product);
router.delete('/products/:id', productController.delete_product);
router.post('/products/:id', productController.update_product);
router.get('/getProductByID/:id', productController.get_product_by_id);

// Upload Image
router.post('/uploadImage', uploadController.upload_image);

module.exports = router;
