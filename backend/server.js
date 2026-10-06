const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

console.log('--- Startup Diagnostics ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('---------------------------');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database (initiated but not blocking routes)
connectDB().catch(err => {
    console.error('❌ Critical database connection error:', err.message);
});

// Routes - Defined synchronously for Vercel compatibility
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
console.log('✅ Routes registered');

// Health check
app.get('/', (req, res) => {
    res.json({
        message: '📚 Library Management API is running!',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error handler
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err.stack);
    res.status(500).json({ message: err.message || 'Server Error' });
});

// Local server listen logic
const startLocalServer = async () => {
    const PORT = process.env.PORT || 5000;
    // Only listen if not on Vercel
    if (!process.env.VERCEL) {
        app.listen(PORT, () => {
            console.log(`🚀 Local Server running on port ${PORT}`);
        });
    }
};

startLocalServer();

module.exports = app;
