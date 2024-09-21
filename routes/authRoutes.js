const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const path = require('path');


router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../views/pages', 'home.html')) });
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;