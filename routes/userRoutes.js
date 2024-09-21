const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const path = require('path');
const auth = require('../middlewares/auth');


router.use(auth.authenticateToken);

// Register and login routes - change to google/facebook later
router.get('/users' ,userController.listAll);

module.exports = router;
