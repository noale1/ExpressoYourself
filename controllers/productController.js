const Product = require('../models/product');

// List all products
exports.list_products = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

// Admin add product
exports.add_product = async (req, res) => {
    const { name, description, price, imageUrl } = req.body;
    const newProduct = new Product({ name, description, price, imageUrl });
    await newProduct.save();
    res.json({ message: 'Product added successfully' });
};

// Admin delete product
exports.delete_product = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
};

// Admin update product
exports.update_product = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product updated successfully' });
};
