const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Book = require('./models/Book');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const seedData = async () => {    
    await connectDB();

    try {
        // Clear existing data
        await User.deleteMany({});
        await Book.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create Admin
        const adminUser = await User.create({
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            status: 'active',
        });
        console.log('✅ Admin created: admin / admin123');

        // Create 10 predefined users
        const users = [];
        for (let i = 1; i <= 10; i++) {
            users.push({
                username: `user${i}`,
                password: `user${i}pass`,
                role: 'user',
                status: 'active',
            });
        }
        await User.create(users);
        console.log('✅ 10 users created (user1/user1pass ... user10/user10pass)');

        // Create sample books
        const books = [
            { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', totalCopies: 5, availableCopies: 5, description: 'A story of the fabulously wealthy Jay Gatsby.' },
            { title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', totalCopies: 3, availableCopies: 3, description: 'A tale of racial injustice and childhood in the American South.' },
            { title: '1984', author: 'George Orwell', category: 'Dystopian', totalCopies: 4, availableCopies: 4, description: 'A dystopian social science fiction novel.' },
            { title: 'Sapiens', author: 'Yuval Noah Harari', category: 'Non-Fiction', totalCopies: 6, availableCopies: 6, description: 'A brief history of humankind.' },
            { title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', totalCopies: 4, availableCopies: 4, description: 'A handbook of agile software craftsmanship.' },
            { title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', totalCopies: 7, availableCopies: 7, description: 'A philosophical novel about personal legend.' },
            { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', category: 'Fantasy', totalCopies: 10, availableCopies: 10, description: 'A young boy discovers he is a wizard.' },
            { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Technology', totalCopies: 3, availableCopies: 3, description: 'From journeyman to master developer.' },
            { title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', totalCopies: 5, availableCopies: 5, description: 'An easy and proven way to build good habits.' },
            { title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction', totalCopies: 4, availableCopies: 4, description: 'A science fiction epic set in the far future.' },
        ];
        await Book.create(books);
        console.log('✅ 10 sample books created');

        console.log('\n🎉 Database seeded successfully!');
        console.log('📋 Login credentials:');
        console.log('   Admin: admin / admin123');
        console.log('   Users: user1/user1pass ... user10/user10pass');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();
