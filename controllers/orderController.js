const Order = require('../models/order');

// List all orders
exports.list_orders = async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
};

