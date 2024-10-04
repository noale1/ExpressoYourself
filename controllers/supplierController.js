const Supplier = require('../models/supplier');
const User = require('../models/user');

// Create a supplier
exports.add_supplier = async (req, res) => {
    const { username, supplier_name, contact_info } = req.body;
    console.log(req.body);
    console.log("add_supplier " + username, supplier_name , contact_info);
    if(!username) return res.status(502).json({ message: 'No user Was specified' });
    if(!supplier_name) return res.status(502).json({ message: 'No supplier name Was specified' });
    if(!contact_info) return res.status(502).json({ message: 'No contact info Was specified' });
    try {
        const user = await User.findOne({ username });
            if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        console.log("[+] We Have a new Supplier here, welcome " + user)
        user.isSuppllier = true; // Set the user as an admin
        const newSupplier = new Supplier({ user: user ,name: supplier_name ,contactInfo: contact_info });
        await newSupplier.save();
        user.supplier = newSupplier;
        await user.save();

        return res.json({ message: `We Have a new Supplier here, ${username} is owning the supplier company named ${supplier_name}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error while adding admin.' });
    }
};

exports.delete_supplier =  async (req, res) => {
    try {
        const supplier = await Supplier.findOne(req.params.supplierName);
        if (!supplier) {
            return res.status(404).json({ message: 'supplier not found' });
        }
        supplier.deleteOne();
        return res.json({ message: 'supplier deleted successfully' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        return res.status(500).json({ message: 'Internal server error' });
    };
};

exports.update_supplier = async (req, res) => {
    try {
        const supplier_name = req.params.supplier_name;
        const updatedData = req.body;

        // Find the supplier by ID and update the fields
        await Supplier.findByIdAndUpdate(supplier_name, updatedData, {runValidators: true });

        // Check if the supplier exists
        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        // Return the updated supplier
        res.status(200).json({message: 'Supplier updated successfully',});

    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};


exports.get_supplier = async (req, res) => {
    try {
        const supplier_name = req.params.supplier_name;

        // Find the supplier by ID and update the fields
        supplier = await Supplier.findOne(supplier_name);

        // Check if the supplier exists
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        // Return the updated supplier
        return res.status(200).json(supplier);

    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};


// List all suppliers for admin
exports.list_all_supplier = async (req, res) => {
    const suppliers = await Supplier.find().populate('user').populate('products.product');
    return res.json(suppliers);
};
