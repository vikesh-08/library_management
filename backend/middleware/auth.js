const jwt = require('jsonwebtoken');
const { getUserById } = require('../utils/authFallback');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await getUserById(decoded.id);

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            if (req.user.status === 'blocked') {
                return res
                    .status(403)
                    .json({ message: 'Your account has been blocked. Contact admin.' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
