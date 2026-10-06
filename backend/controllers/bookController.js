const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/books
// @access  Private
const getAllBooks = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
            ];
        }

        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        const books = await Book.find(query).sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Private
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Admin
const addBook = async (req, res) => {
    try {
        const { title, author, category, totalCopies, availableCopies, description } = req.body;

        if (!title || !author || !category || !totalCopies) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const book = await Book.create({
            title,
            author,
            category,
            totalCopies,
            availableCopies: availableCopies ?? totalCopies,
            description: description || '',
        });

        res.status(201).json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Admin
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const { title, author, category, totalCopies, availableCopies, description } = req.body;

        book.title = title || book.title;
        book.author = author || book.author;
        book.category = category || book.category;
        book.totalCopies = totalCopies ?? book.totalCopies;
        book.availableCopies = availableCopies ?? book.availableCopies;
        book.description = description ?? book.description;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Admin
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllBooks, getBookById, addBook, updateBook, deleteBook };
