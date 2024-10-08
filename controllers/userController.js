const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//TODO: crud for user -> DONE
//TODO: hash password in the create function -> DONE
//TODO: validate jwt -> DONE
//TODO: make jwt secret in the .env -> DONE
//TODO: enforce auth -> DONE
//TODO: validate admin 
//TODO: Logoff

//list all Users
exports.listAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        const successMessage = req.query.message;
        return res.json({ users, successMessage });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete a user by username
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOne(req.params.username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.deleteOne();
        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    };
};


exports.deleteAllUsers = async (req, res) => {
    try {
        const result = await User.deleteMany({});
        return res.json({ message: 'All Users deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    };
};

// Add Admin
exports.addAdmin = async (req, res) => {
    if(!req.query.user) return res.status(502).json({ message: 'No user Was specified' });
    const username = req.query.user;
    try {
        const user = await User.findOne({ username });
            if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        console.log("We Have a new Admin here, Welcome to the white Family " + username)
        user.isAdmin = true; // Set the user as an admin
        await user.save();

        return res.json({ message: `We Have a new Admin here, Welcome to the white Family + ${username}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error while adding admin.' });
    }
};

// Revoke Admin
exports.revokeAdmin = async (req, res) => {
    const { username } = req.query.user;
    if(!username) return res.status(502).json({ message: 'No user Was specified' });

    try {
        const user = await User.findOne(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.isAdmin = false; // Remove admin privileges
        await user.save();

        return res.json({ message: `User ${user.username} has been revoked admin privileges.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error while revoking admin.' });
    }
};








