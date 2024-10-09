const express = require('express');
const router = express.Router();
const supplierController = require('../../controllers/supplierController');
const path = require('path');
const auth = require('../../middlewares/auth_midware');
const supplierMidWare = require('../../middlewares/supplier_midware');
const orderController = require('../../controllers/orderController');
const invitationController = require('../../controllers/invitationController');
const RELATIVE_PAGES_PATH = '../../views/pages';


router.use( auth.authenticateToken )
router.use( supplierMidWare.isSupplier  );

// inviations
router.patch('/invitations/:id/status', invitationController.update_invitation_status);
router.get('/invitations/supplier', invitationController.get_invitations_by_supplier);
router.get('/invitaionManagment', (req, res) => { res.sendFile(path.join(__dirname, RELATIVE_PAGES_PATH, 'SupplierInvitaion.html')) });


module.exports = router;