const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    addUser,
    toggleBlockUser,
    deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/', protect, adminOnly, getAllUsers);
router.post('/', protect, adminOnly, addUser);
router.put('/block/:id', protect, adminOnly, toggleBlockUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
