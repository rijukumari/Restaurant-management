const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, trackOrder, updateOrderStatus, getMyOrders, getKitchenOrders, getTodayStats } = require('../controllers/orderController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');

router.post('/', optionalAuth, createOrder);
router.get('/track/:orderNumber', trackOrder);
router.get('/kitchen', protect, authorize('admin', 'manager', 'chef', 'kitchen_staff'), getKitchenOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/stats/today', protect, authorize('admin', 'manager'), getTodayStats);
router.get('/', protect, authorize('admin', 'manager', 'waiter', 'cashier'), getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', protect, authorize('admin', 'manager', 'chef', 'kitchen_staff', 'waiter'), updateOrderStatus);

module.exports = router;
