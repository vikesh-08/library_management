const express = require('express');
const router = express.Router();
const {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/', protect, getAllBooks);
router.get('/:id', protect, getBookById);
router.post('/', protect, adminOnly, addBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;
