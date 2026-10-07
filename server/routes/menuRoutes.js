const express = require('express');
const router = express.Router();
const { getMenuItems, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem, getBestsellers } = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

router.get('/bestsellers', getBestsellers);
router.get('/', getMenuItems);
router.get('/:id', getMenuItem);
router.post('/', protect, authorize('admin', 'manager'), createMenuItem);
router.put('/:id', protect, authorize('admin', 'manager'), updateMenuItem);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteMenuItem);

module.exports = router;
