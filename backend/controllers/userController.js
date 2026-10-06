const mongoose = require('mongoose');
const User = require('../models/User');
const {
    getAllFallbackUsers,
    createFallbackUser,
    toggleFallbackUserStatus,
    deleteFallbackUser,
} = require('../utils/authFallback');

const isDbConnected = () => mongoose.connection.readyState === 1;

const dbTimeout = (ms = 2000) => new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Database timeout')), ms);
});

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
const getAllUsers = async (req, res) => {
    try {
        if (!isDbConnected()) {
            return res.json(getAllFallbackUsers());
        }

        const users = await Promise.race([
            User.find().select('-password').sort({ createdAt: -1 }),
            dbTimeout(),
        ]);
        return res.json(users);
    } catch (error) {
        console.error('Get users error:', error.message);
        return res.json(getAllFallbackUsers());
    }
};

// @desc    Add new user
// @route   POST /api/users
// @access  Admin
const addUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ message: 'Username and password are required' });
        }

        try {
            if (!isDbConnected()) {
                throw new Error('Database not connected');
            }

            const existingUser = await Promise.race([
                User.findOne({ username }),
                dbTimeout(),
            ]);
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const user = await Promise.race([
                User.create({
                    username,
                    password,
                    role: role || 'user',
                    status: 'active',
                }),
                dbTimeout(),
            ]);

            return res.status(201).json({
                _id: user._id,
                username: user.username,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt,
            });
        } catch (error) {
            try {
                const fallbackUser = await createFallbackUser({
                    username,
                    password,
                    role: role || 'user',
                    status: 'active',
                });
                return res.status(201).json(fallbackUser);
            } catch (fallbackError) {
                if (fallbackError.message === 'Username already exists') {
                    return res.status(400).json({ message: 'Username already exists' });
                }
                console.error('Add user fallback error:', fallbackError.message);
                return res.status(500).json({ message: 'Server error' });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Block or unblock user
// @route   PUT /api/users/block/:id
// @access  Admin
const toggleBlockUser = async (req, res) => {
    try {
        try {
            if (!isDbConnected()) {
                throw new Error('Database not connected');
            }

            const user = await Promise.race([
                User.findById(req.params.id),
                dbTimeout(),
            ]);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Cannot block an admin user' });
            }

            user.status = user.status === 'active' ? 'blocked' : 'active';
            await Promise.race([
                user.save(),
                dbTimeout(),
            ]);

            return res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                status: user.status,
            });
        } catch (error) {
            try {
                const fallbackUser = await toggleFallbackUserStatus(req.params.id);
                return res.json(fallbackUser);
            } catch (fallbackError) {
                return res.status(500).json({ message: 'Server error' });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
    try {
        try {
            if (!isDbConnected()) {
                throw new Error('Database not connected');
            }

            const user = await Promise.race([
                User.findById(req.params.id),
                dbTimeout(),
            ]);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Cannot delete an admin user' });
            }

            await Promise.race([
                User.findByIdAndDelete(req.params.id),
                dbTimeout(),
            ]);
            return res.json({ message: 'User deleted successfully' });
        } catch (error) {
            try {
                await deleteFallbackUser(req.params.id);
                return res.json({ message: 'User deleted successfully' });
            } catch (fallbackError) {
                return res.status(500).json({ message: 'Server error' });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllUsers, addUser, toggleBlockUser, deleteUser };
