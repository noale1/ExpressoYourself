const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
    }],
    contactInfo: { 
        phone: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^\+?[1-9]\d{1,14}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            }
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function(v) {
                    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            }
        },
        address: { 
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String },
            zipCode: { type: String },
            country: {
                type: String,
                required: true
            }
        }
    }
}, { versionKey: false });

module.exports = mongoose.model('Supplier', supplierSchema);
