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
        user.isSupplier = true;
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
        supplier = await Supplier.findOne(supplier_name).populate({
            path: 'products.product',
            model: 'Product',
        });

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
    try {
        const { email, city, state, name, productName } = req.query;
        let query = {};

        // filter by the start of the email
        if (email) {
            query['contactInfo.email'] = { $regex: `^${email}`, $options: 'i' }; 
        }

        // filter by state + city 
        if (state || city) {
            if (city) query['contactInfo.address.city'] = { $regex: city, $options: 'i' };
            if (state) query['contactInfo.address.state'] = { $regex: state, $options: 'i' };
        }

        // filter by supplier name
        if (name) {
            query['name'] = { $regex: name, $options: 'i' }; 
        }

        // filter by product name 
        let suppliersQuery = Supplier.aggregate([
            { $match: query },  // Apply other supplier filters (like by name or location)
            { 
                $lookup: {
                    from: 'products',
                    localField: 'products.product',
                    foreignField: '_id',
                    as: 'products',
                }
            },
            { 
                $match: productName ? { 'products.name': { $regex: productName, $options: 'i' } } : {}
            }
        ]);

        const suppliers = await suppliersQuery.exec();

        return res.json(suppliers);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.add_product_to_supplier = async (req, res) => {
    try {
        const { supplierName, productId } = req.body;
        const supplier = await Supplier.findOne({ name: supplierName.trim() });

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        const productExists = supplier.products.some(
            (p) => p.product.toString() === productId
        );

        if (productExists) {
            return res.status(400).json({ message: 'Product already exists in the supplier\'s product list' });
        }

        supplier.products.push({ product: productId });
        await supplier.save();

        res.status(200).json({ message: 'Product successfully added to supplier', supplier });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.remove_product_from_supplier = async (req, res) => {
    try {
        const { supplierName, productId } = req.body;
        const supplier = await Supplier.findOne({ name: supplierName.trim() });

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        const productExists = supplier.products.some(
            (p) => p.product.toString() === productId
        );

        if (!productExists) {
            return res.status(400).json({ message: 'Product Does Not exists in the supplier\'s product list' });
        }

        supplier.products.deleteOne({ product: productId });
        await supplier.save();

        res.status(200).json({ message: 'Product successfully Deleted from supplier', supplier });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.get_suppliers_by_country = async (req, res) => {
    try {
      const suppliersByCountry = await Supplier.aggregate([
        {
          $group: {
            _id: "$contactInfo.address.country",
            count: { $sum: 1 } 
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
  
      res.json(suppliersByCountry); 
    } catch (error) {
      console.error('Error aggregating suppliers by country:', error);
      res.status(500).send('Server Error');
    }
  };

  exports.get_products_per_supplier = async (req, res) => {
    try {
      const productsPerSupplier = await Supplier.aggregate([
        {
          $unwind: "$products"
        },
        {
          $group: {
            _id: "$name",  
            productCount: { $sum: 1 } 
          }
        },
      ]);
  
      res.json(productsPerSupplier);
    } catch (error) {
      console.error('Error aggregating products per supplier:', error);
      res.status(500).send('Server Error');
    }
  };