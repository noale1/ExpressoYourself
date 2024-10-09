const express = require('express');
const router = express.Router();
const RELATIVE_PAGES_PATH = '../views/pages';
const path = require('path');

const publicRoutes = require('./public/publicRoutes.js');
router.use('/', publicRoutes);


const publicAPIRoutes = require('./public/apiRoutes.js');
router.use('/api', publicAPIRoutes);


const privateRoutes = require('./private/privateRoutes.js');
router.use('/private',privateRoutes);


const adminRoutes = require('./admin/adminRoutes.js');
router.use('/admin', adminRoutes);

// 404 Page
router.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, '404.html'));
});


module.exports = router;