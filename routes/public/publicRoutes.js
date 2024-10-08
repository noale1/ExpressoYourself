const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../../controllers/authController');
const RELATIVE_PAGES_PATH = '../../views/pages';


// home page
router.get('/', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'home.html'))});

// product page
router.get('/products', (req, res) => {res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'products.html'))});

//About Page
router.get('/about', (req, res) => {res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH,'AboutPage.html'));});

//ContactUs Page
router.get('/contact', (req, res) => {res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH,'ContactUs.html'));});



// login and register pages
router.get('/login', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'login.html'))});
router.get('/register', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'register.html'))});
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// map page
router.get('/locations', (req, res) => {res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH,'locations.html'));});




router.get('/controllers/currencyController.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../../controllers', 'currencyController.js'));
});

router.get('/models/currency.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../../models', 'currency.js'));
});



module.exports = router;