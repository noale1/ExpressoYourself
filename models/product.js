const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String
    },
    category: {
        type: String
    },
    inStock: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Product', productSchema);