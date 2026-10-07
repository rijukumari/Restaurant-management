const express = require('express');
const router = express.Router();
const { getStaff, addStaff, updateStaff, deleteStaff, getCustomers } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'manager'), getStaff);
router.post('/', protect, authorize('admin'), addStaff);
router.put('/:id', protect, authorize('admin'), updateStaff);
router.delete('/:id', protect, authorize('admin'), deleteStaff);
router.get('/customers', protect, authorize('admin', 'manager'), getCustomers);

module.exports = router;
