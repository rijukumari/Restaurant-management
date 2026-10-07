const express = require('express');
const router = express.Router();
const { createReservation, getReservations, updateReservationStatus, updateReservation, deleteReservation, getTodayCount } = require('../controllers/reservationController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');

router.post('/', optionalAuth, createReservation);
router.get('/today/count', protect, authorize('admin', 'manager'), getTodayCount);
router.get('/', protect, authorize('admin', 'manager', 'waiter'), getReservations);
router.put('/:id', protect, authorize('admin', 'manager'), updateReservation);
router.put('/:id/status', protect, authorize('admin', 'manager'), updateReservationStatus);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteReservation);

module.exports = router;
