const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const path = require('path');
const auth = require('../middlewares/auth');


router.use(auth.authenticateToken);

// Register and login routes - change to google/facebook later
router.get('/getUsers' ,userController.listAll);
router.get('/deleteUsers' ,userController.deleteAll);

module.exports = router;
