const Supplier = require('../models/supplier');

// Create a supplier
exports.create_supplier = async (req, res) => {
    const { userId, products, total } = req.body;
    const newSupplier = new Order({ supplier: supplierId, products, total });
    await newSupplier.save();
    res.json({ message: 'Supplier placed successfully' });
};

// List all suppliers for admin
exports.list_supplier = async (req, res) => {
    const suppliers = await Supplier.find().populate('supplier').populate('products.product');
    res.json(suppliers);
};
