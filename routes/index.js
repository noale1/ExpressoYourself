const express = require('express');
const router = express.Router();

const publicRoutes = require('./public/publicRoutes.js');
router.use('/', publicRoutes);


const publicAPIRoutes = require('./public/apiRoutes.js');
router.use('/api', publicAPIRoutes);


const privateRoutes = require('./private/privateRoutes.js');
router.use('/private',privateRoutes);

const adminRoutes = require('./admin/adminRoutes.js');
router.use('/admin', adminRoutes);


module.exports = router;