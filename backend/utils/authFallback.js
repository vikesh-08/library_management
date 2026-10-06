const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const fallbackUsers = [
    {
        _id: 'fallback-admin',
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
    },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

const getUserByUsername = async (username) => {
    if (isDbConnected()) {
        try {
            const user = await User.findOne({ username });
            if (user) {
                return user;
            }
        } catch (error) {
            console.warn('⚠️ Falling back to local auth because MongoDB lookup failed:', error.message);
        }
    }

    const fallbackUser = fallbackUsers.find((user) => user.username === username);
    return fallbackUser ? { ...fallbackUser } : null;
};

const getUserById = async (id) => {
    if (isDbConnected()) {
        try {
            const user = await User.findById(id).select('-password');
            if (user) {
                return user;
            }
        } catch (error) {
            console.warn('⚠️ Falling back to local auth profile lookup because MongoDB lookup failed:', error.message);
        }
    }

    const fallbackUser = fallbackUsers.find((user) => user._id === id || user.username === id);
    if (fallbackUser) {
        const { password, ...safeUser } = fallbackUser;
        return safeUser;
    }

    return null;
};

const comparePassword = async (user, enteredPassword) => {
    if (!user || !enteredPassword) {
        return false;
    }

    if (typeof user.password === 'string' && user.password.startsWith('$2')) {
        return bcrypt.compare(enteredPassword, user.password);
    }

    return user.password === enteredPassword;
};

const getAllFallbackUsers = () => {
    return fallbackUsers
        .map((user) => {
            const { password, ...safeUser } = user;
            return safeUser;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const createFallbackUser = async ({ username, password, role = 'user', status = 'active' }) => {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    const existingUser = fallbackUsers.find((user) => user.username === username);
    if (existingUser) {
        throw new Error('Username already exists');
    }

    const newUser = {
        _id: `fallback-user-${Date.now()}`,
        username,
        password: bcrypt.hashSync(password, 10),
        role,
        status,
        createdAt: new Date().toISOString(),
    };

    fallbackUsers.push(newUser);

    const { password: _password, ...safeUser } = newUser;
    return safeUser;
};

const toggleFallbackUserStatus = async (id) => {
    const user = fallbackUsers.find((entry) => entry._id === id);
    if (!user) {
        throw new Error('User not found');
    }

    if (user.role === 'admin') {
        throw new Error('Cannot block an admin user');
    }

    user.status = user.status === 'active' ? 'blocked' : 'active';
    const { password, ...safeUser } = user;
    return safeUser;
};

const deleteFallbackUser = async (id) => {
    const index = fallbackUsers.findIndex((entry) => entry._id === id);
    if (index === -1) {
        throw new Error('User not found');
    }

    const user = fallbackUsers[index];
    if (user.role === 'admin') {
        throw new Error('Cannot delete an admin user');
    }

    fallbackUsers.splice(index, 1);
    return true;
};

module.exports = {
    getUserByUsername,
    getUserById,
    comparePassword,
    getAllFallbackUsers,
    createFallbackUser,
    toggleFallbackUserStatus,
    deleteFallbackUser,
};
