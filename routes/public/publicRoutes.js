const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../../controllers/authController');
const RELATIVE_PAGES_PATH = '../../views/pages';


// home page
router.get('/', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'home.html'))});

// product page
router.get('/products', (req, res) => {res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'products.html'))});


// login and register pages
router.get('/login', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'login.html'))});
router.get('/register', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'register.html'))});
router.post('/register', authController.register);
router.post('/login', authController.login);

// map page
router.get('/locations', (req, res) => {res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH,'locations.html'));});





module.exports = router;