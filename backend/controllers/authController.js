const jwt = require('jsonwebtoken');
const { getUserByUsername, getUserById, comparePassword } = require('../utils/authFallback');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ message: 'Please provide username and password' });
        }

        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.status === 'blocked') {
            return res
                .status(403)
                .json({ message: 'Your account has been blocked. Contact admin.' });
        }

        const isMatch = await comparePassword(user, password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            status: user.status,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('🔥 Login Error Details:', {
            message: error.message,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await getUserById(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginUser, getMe };
