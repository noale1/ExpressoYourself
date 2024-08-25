const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register and login routes - change to google/facebook later
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
