const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const path = require('path');


router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../views/pages', 'home.html')) });
router.get('/register', (req, res) => { res.sendFile(path.join(__dirname, '../views/pages', 'register.html')) });
router.post('/register', authController.register);
router.get('/login', (req, res) => { res.sendFile(path.join(__dirname, '../views/pages', 'login.html')) });
router.post('/login', authController.login);

module.exports = router;