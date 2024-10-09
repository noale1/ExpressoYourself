const Invitation = require('../models/invitation');
const Supplier = require('../models/supplier');
const Product = require('../models/product');
const jwt = require('jsonwebtoken');


exports.create_invitation = async (req, res) => {
    const { supplierName, productId, quantity } = req.body;
    
    try {
        // Check if supplier and product exist
        const supplier = await Supplier.findOne({ name: supplierName.trim() });
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
		
		if (quantity < 1) return res.status(404).json({ message: 'quantity too low' });
        // Create the invitation
        const invitation = new Invitation({ supplier: supplier._id, product: productId, quantity: quantity });
        await invitation.save();

        res.status(201).json(invitation);
    } catch (error) {
        console.error('Error creating invitation:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.update_invitation = async (req, res) => {
    const { id } = req.params;
    const { supplierId, productId } = req.body;

    try {
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const invitation = await Invitation.findByIdAndUpdate(id, { supplier: supplierId, product: productId }, { new: true });
        if (!invitation) return res.status(404).json({ message: 'Invitation not found' });

        res.json(invitation);
    } catch (error) {
        console.error('Error updating invitation:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.delete_invitation = async (req, res) => {
    const { id } = req.params;

    try {
        const invitation = await Invitation.findByIdAndDelete(id);
        if (!invitation) return res.status(404).json({ message: 'Invitation not found' });

        res.json({ message: 'Invitation deleted successfully' });
    } catch (error) {
        console.error('Error deleting invitation:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.get_invitations_by_supplier = async (req, res) => {
    const token = req.headers['cookie']?.split('=')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;  

        const supplier = await Supplier.findOne({ user: userId });
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        const invitations = await Invitation.find({ supplier: supplier._id }).populate('product');
        if (!invitations.length) return res.status(404).json({ message: 'No invitations found for this supplier' });

        res.json(invitations);
    } catch (error) {
        console.error('Error fetching supplier invitations:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.get_all_invitations = async (req, res) => {
    const { supplierId, productName, status, startDate, endDate } = req.query;
    let filter = {};

    try {
        // Filter by supplier ID
        if (supplierId) {
            filter.supplier = supplierId;
        }

        // Filter by product ID
        if (productName) {
            const product = await Product.findOne({ name: productName.trim() });
            if (product){
                filter.product = product._id;
            }
            else {
                console.log("Error fetching invitations:can't Product");
                return res.status(500).json({ message: 'The product you want does not exists' });
            }
        }

        // Filter by status
        if (status) {
            filter.status = status;
        }

        // Filter by creation date 
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);  // Start date filter
            }
            if (endDate) {
                filter.createdAt.$lte = new Date(endDate);    // End date filter
            }
        }

        // Fetch invitations with applied filters
        const invitations = await Invitation.find(filter).populate('supplier').populate('product');
        res.json(invitations);
    } catch (error) {
        console.error('Error fetching invitations:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.update_invitation_status = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'in progress', 'declined', 'completed'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const invitation = await Invitation.findById(id);
        if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
        if (['declined', 'completed'].includes(invitation.status)) return res.status(500).json({ message: "can't change status completed/declinde" })

        invitation.status = status;
        
        if (status === 'completed') {
            const product = await Product.findById(invitation.product);
            product.quantity += invitation.quantity;
            await product.save()
        }

        await invitation.save();

        res.json({ message: 'Invitation status updated successfully', invitation });
    } catch (error) {
        console.error('Error updating invitation status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};