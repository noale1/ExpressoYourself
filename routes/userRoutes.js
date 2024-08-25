const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const path = require('path');

// Register and login routes - change to google/facebook later
router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../views', 'home.html')) });
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
