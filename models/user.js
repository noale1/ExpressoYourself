const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Supplier = require('./supplier');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,  // Remove leading and trailing spaces
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,  // Case-insensitive
        validate: {
            validator: function(v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);  // Email format validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isSupplier: {
        type: Boolean,
        default: false  // Tracks if user is also a supplier
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'  // Reference to the Supplier model
    }
    
},{ versionKey: false });

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
    }
    next(); // Proceed to save the user
});

userSchema.pre('deleteOne', async function(next) {
    try {
        // Remove all suppliers linked to this user
        await Supplier.deleteMany({ user: this.username });
        next(); // Continue with the deletion of the user
    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
});

userSchema.pre('deleteMany', async function(next) {
    try {
        const filter = this.getFilter();  // Get the filter used in deleteMany
        const usersToDelete = await mongoose.model('User').find(filter);  // Find all users to be deleted

        // Get all the user IDs that are about to be deleted
        const userIds = usersToDelete.map(user => user._id);

        // Delete all suppliers linked to those user IDs
        await Supplier.deleteMany({ user: { $in: userIds } });

        next();  // Continue with the deletion of the users
    } catch (error) {
        next(error);  // Pass the error to the next middleware
    }
});

module.exports = mongoose.model('User', userSchema);

