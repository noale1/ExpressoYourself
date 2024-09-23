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
exports.listAll = async (req, res) => {
    console.log("a")
    try {
        console.log("b")
        const users = await User.find();
        const successMessage = req.query.message;
        console.log("C")
        res.json({ users, successMessage });
        console.log("D")
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

// Delete a user by username
exports.delete = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    };
};


exports.deleteAll = async (req, res) => {
    try {
        const result = await User.deleteMany({});
        res.json({ message: 'All Users deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    };
};





