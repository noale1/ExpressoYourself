const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Supplier = require('./supplier');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
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
        default: false
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    }
    
},{ versionKey: false });

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.pre('deleteOne', async function(next) {
    try {
        await Supplier.deleteMany({ user: this.username });
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.pre('deleteMany', async function(next) {
    try {
        const filter = this.getFilter();
        const usersToDelete = await mongoose.model('User').find(filter);

        const userIds = usersToDelete.map(user => user._id);

        await Supplier.deleteMany({ user: { $in: userIds } });

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);

