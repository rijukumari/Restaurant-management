const express = require('express');
const router = express.Router();
const { getCategories, getAllCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCategories);
router.get('/admin', protect, authorize('admin', 'manager'), getAllCategories);
router.post('/', protect, authorize('admin', 'manager'), createCategory);
router.put('/:id', protect, authorize('admin', 'manager'), updateCategory);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteCategory);

module.exports = router;
