const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Book title is required'],
            trim: true,
        },
        author: {
            type: String,
            required: [true, 'Author name is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        totalCopies: {
            type: Number,
            required: [true, 'Total copies is required'],
            min: [1, 'Total copies must be at least 1'],
        },
        availableCopies: {
            type: Number,
            required: [true, 'Available copies is required'],
            min: [0, 'Available copies cannot be negative'],
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
