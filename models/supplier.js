const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    contactInfo: { 
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        address: { 
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: {
                type: String,
                required: true
            }
        }
    }
});

module.exports = mongoose.model('Supplier', supplierSchema);
