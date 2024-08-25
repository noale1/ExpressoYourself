const Order = require('../models/order');

// Create an order
exports.create_order = async (req, res) => {
    const { userId, products, total } = req.body;
    const newOrder = new Order({ user: userId, products, total });
    await newOrder.save();
    res.json({ message: 'Order placed successfully' });
};

// List all orders for admin
exports.list_orders = async (req, res) => {
    const orders = await Order.find().populate('user').populate('products.product');
    res.json(orders);
};
