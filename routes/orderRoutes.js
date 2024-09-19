const express = require('express');
const router = express.Router();
const productController = require('../controllers/orderController');
const path = require('path');

router.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../views/pages', 'order.html')) });
router.post('/api/order', async (req, res) => {
    const cart = req.body.cart; 
    const userDetails = req.body.userDetails; 

    try {
        res.status(200).json({ message: 'Checkout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error during checkout' });
    }
});

// Fetch order details for a specific user (or session)
router.get('/api/cart/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find the order by user ID (or session ID)
        const order = await Order.findOne({ user }); 
        if (!order) {
            return res.status(404).json({ message: 'No active order found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order' });
    }
});

module.exports = router;