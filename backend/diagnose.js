const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const diagnose = async () => {
    try {
        console.log('--- Diagnostics ---');
        console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
        console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const userCount = await User.countDocuments();
        console.log('User count:', userCount);

        const admin = await User.findOne({ username: 'admin' });
        if (admin) {
            console.log('✅ Admin user found');
            console.log('Admin role:', admin.role);
        } else {
            console.log('❌ Admin user NOT found');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Diagnostic failed:', error.message);
        process.exit(1);
    }
};

diagnose();
