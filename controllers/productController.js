const Product = require('../models/product');

// List all products
exports.list_products = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

// Add a new product
exports.add_product = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        res.status(400).json({ message: 'Error adding product', error });
    }
};

// Update an existing product
exports.update_product = async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error });
    }
};

// Delete a product
exports.delete_product = async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting product', error });
    }
};



exports.get_products = async(req, res) => {
    try {
        const filters = req.query;  
        let query = {};

        // Handle price range filter
        if (filters.minPrice || filters.maxPrice) {
            query.price = {};
            if (filters.minPrice) {
                query.price.$gte = parseFloat(filters.minPrice);  // Only add $gte if minPrice is provided
            }
            if (filters.maxPrice) {
                query.price.$lte = parseFloat(filters.maxPrice);  // Only add $lte if maxPrice is provided
            }
        }

        // Handle category filter
        if (filters.category && filters.category.trim() !== "" && filters.category !== "AllCategories") {
            query.category = filters.category;
        }

        // Handle inStock filter
        if (filters.inStock !== undefined) {
            query.inStock = filters.inStock === 'true'; 
        }

        // Handle descriptionContains filter
        if (filters.descriptionContains && filters.descriptionContains.trim() !== "") {
            query.description = { $regex: filters.descriptionContains, $options: 'i' }; 
        }

        console.log('Filters:', filters);
        console.log('Constructed query:', query);

        // Use the constructed query, not filters
        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error filtering products:", error);
        res.status(500).json({ error: 'An error occurred while fetching products.' });
    }
};

exports.get_categories = async (req, res) => {
    try {
        // Use Mongoose distinct method to get unique categories
        const categories = await Product.distinct('category');

        // Log the categories to the console
        console.log('Unique categories:', categories);

        // Return the unique categories as a set
        res.status(200).json({ categories: [...new Set(categories)] });
    } catch (error) {
        console.error('Error fetching unique categories:', error);
        res.status(500).json({ error: 'An error occurred while fetching categories.' });
    }
};