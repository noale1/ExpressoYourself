const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../../controllers/authController');

// home page
router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../../views/pages', 'home.html'))});

// product page
router.get('/products', (req, res) => {res.sendFile(path.join(__dirname, '../../views/pages', 'products.html'))});


// login and register pages
router.get('/login', (req, res) => { res.sendFile(path.join(__dirname, '../../views/pages', 'login.html'))});
router.get('/register', (req, res) => { res.sendFile(path.join(__dirname, '../../views/pages', 'register.html'))});
router.post('/register', authController.register);
router.post('/login', authController.login);

// map page
router.get('/map', (req, res) => {res.sendFile(path.join(__dirname, '../../views/locations.html'));});

// order page
router.get('/order', (req, res) => { res.sendFile(path.join(__dirname, '../../views/pages', 'order.html')) });




module.exports = router;