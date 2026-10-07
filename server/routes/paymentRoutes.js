const express = require('express');
const router = express.Router();
const { getPayments, updatePayment, verifyPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'manager', 'cashier'), getPayments);
router.put('/:id', protect, authorize('admin', 'manager', 'cashier'), updatePayment);
router.post('/verify', verifyPayment);

module.exports = router;
