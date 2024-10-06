const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const supplierController = require('../../controllers/supplierController');
const productController = require('../../controllers/productController');
const uploadController = require('../../controllers/uploadController');
const orderController = require('../../controllers/orderController');
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
router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../../views/pages', 'adminPanel.html')) });
router.get('/products', (req, res) => { res.sendFile(path.join(__dirname, '../../views/pages', 'adminProducts.html')) });
router.get('/productPage/:id', (req, res) => { res.sendFile(path.join(__dirname, '../../views/pages', 'adminProductPage.html')) });
router.post('/products', productController.add_product);
router.delete('/products/:id', productController.delete_product);
router.post('/products/:id', productController.update_product);
router.get('/getProductByID/:id', productController.get_product_by_id);

// Upload Image
router.post('/uploadImage', uploadController.upload_image);

// Graphs
router.get('/getGraphs', (req, res) => { res.sendFile(path.join(__dirname, '../../views/pages', 'graphs.html')) });
router.get('/getGraph/topProducts', orderController.get_top_saled_product_graph);
router.get('/getGraph/orderPerDay', orderController.get_order_count_per_day_last_week_graph);
router.get('/getGraph/salesPerDay', orderController.get_sales_per_day_last_week);
router.get('/getGraph/productPerCategory', productController.get_product_per_category_graph);
router.get('/getGraph/productPerPrice', productController.get_product_per_price_graph);
router.get('/getGraph/suppliersByCountry', supplierController.get_suppliers_by_country);
router.get('/getGraph/productsPerSupplier', supplierController.get_products_per_supplier);



module.exports = router;
