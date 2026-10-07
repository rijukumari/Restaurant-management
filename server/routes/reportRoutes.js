const express = require('express');
const router = express.Router();
const { getSalesReport, getPopularItems, getAnalytics } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/sales', protect, authorize('admin', 'manager'), getSalesReport);
router.get('/popular-items', protect, authorize('admin', 'manager'), getPopularItems);
router.get('/analytics', protect, authorize('admin', 'manager'), getAnalytics);

module.exports = router;
