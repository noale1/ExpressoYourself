const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const supplierController = require('../../controllers/supplierController');
const productController = require('../../controllers/productController');
const uploadController = require('../../controllers/uploadController.js');
const orderController = require('../../controllers/orderController');
const invitationController = require('../../controllers/invitationController');
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

// Home
router.get('/', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'adminPanel.html')) });

// Supplier routes
router.post('/addSupplier', supplierController.add_supplier);
router.get('/addSupplier', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'addSupplier.html')) });
router.get('/suplliersManagment', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'suplliersManagment.html')) });
router.get('/listAllSuppliers', supplierController.list_all_supplier);
router.get('/deleteSupplier', supplierController.delete_supplier);
router.get('/getSupplier', supplierController.get_supplier);
router.post('/addProdectToSupplier', supplierController.add_product_to_supplier);


// order routes
router.get('/listOrders', orderController.list_orders);


// Product Routes
router.get('/products', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'adminProducts.html')) });
router.get('/addProducts', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'addProduct.html')) });
router.get('/productPage/:id', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'adminProductPage.html')) });
router.post('/addProducts', productController.add_product);
router.delete('/products/:id', productController.delete_product);
router.post('/products/:id', productController.update_product);
router.get('/getProductByID/:id', productController.get_product_by_id);

// Upload Image
router.post('/uploadImage', uploadController.upload_image);

// Graphs
router.get('/getGraphs', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'graphs.html')) });
router.get('/getGraph/topProducts', orderController.get_top_saled_product_graph);
router.get('/getGraph/orderPerDay', orderController.get_order_count_per_day_last_week_graph);
router.get('/getGraph/salesPerDay', orderController.get_sales_per_day_last_week);
router.get('/getGraph/productPerCategory', productController.get_product_per_category_graph);
router.get('/getGraph/productPerPrice', productController.get_product_per_price_graph);
router.get('/getGraph/suppliersByCountry', supplierController.get_suppliers_by_country);
router.get('/getGraph/productsPerSupplier', supplierController.get_products_per_supplier);


// Supllier invitaions
router.post('/invitations', invitationController.create_invitation);
router.put('/invitations/:id', invitationController.update_invitation);
router.delete('/invitations/:id', invitationController.delete_invitation);
router.get('/invitations', invitationController.get_all_invitations);
router.get('/invitaionManagment', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'AdminInvitation.html')) });
router.get('/createinvItaion/:id', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'AddInvatation.html')) });



module.exports = router;
