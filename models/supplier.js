const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true  // Every supplier must be associated with a user
    },
    name: {
        type: String,
        required: true,
        unique: true,  // Each supplier should have a unique name
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


// supplierSchema.pre('deleteOne', async function(next) {
//     try {
//         // Remove all suppliers linked to this user
//         await products.deleteMany({ user: this.username });
//         next(); // Continue with the deletion of the user
//     } catch (error) {
//         next(error); // Pass the error to the next middleware
//     }
// });

module.exports = mongoose.model('Supplier', supplierSchema);
