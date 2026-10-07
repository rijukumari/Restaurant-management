const express = require('express');
const router = express.Router();
const { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, restockItem } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'manager', 'chef'), getInventory);
router.post('/', protect, authorize('admin', 'manager'), addInventoryItem);
router.put('/:id', protect, authorize('admin', 'manager'), updateInventoryItem);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteInventoryItem);
router.put('/:id/restock', protect, authorize('admin', 'manager'), restockItem);

module.exports = router;
