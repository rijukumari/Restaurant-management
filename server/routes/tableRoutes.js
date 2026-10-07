const express = require('express');
const router = express.Router();
const { getTables, getTable, createTable, updateTable, deleteTable, generateQR, updateTableStatus, getTableByNumber } = require('../controllers/tableController');
const { protect, authorize } = require('../middleware/auth');

router.get('/number/:tableNumber', getTableByNumber);
router.get('/', getTables);
router.get('/:id', getTable);
router.post('/', protect, authorize('admin', 'manager'), createTable);
router.put('/:id', protect, authorize('admin', 'manager'), updateTable);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteTable);
router.post('/:id/qr', protect, authorize('admin', 'manager'), generateQR);
router.put('/:id/status', protect, authorize('admin', 'manager', 'waiter'), updateTableStatus);

module.exports = router;
