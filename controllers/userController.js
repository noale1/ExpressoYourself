const User = require('../models/user');

// Register new user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.json({ message: 'User registered successfully' });
};

// Login - change to google/facebook login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.json({ message: 'Login successful', user });
    } else {
        res.json({ message: 'Invalid credentials' });
    }
};
