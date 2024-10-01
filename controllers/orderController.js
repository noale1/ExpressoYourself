const Order = require('../models/order');

// List all orders
exports.list_orders = async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
};


exports.checkout = async (req, res) => {
    const cart = req.body.cart; 
    const userDetails = req.body.userDetails; 

    try {
        res.status(200).json({ message: 'Checkout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error during checkout' });
    }
};

exports.getUserCart = async (req, res) => {
    const user = req.params.user;

    try {
        // Find the order by user (or session ID)
        const order = await Order.findOne({ user }); 
        if (!order) {
            return res.status(404).json({ message: 'No active order found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order' });
    }
};