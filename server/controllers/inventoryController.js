const Inventory = require('../models/Inventory');

// @desc    Get all inventory items
// @route   GET /api/inventory
exports.getInventory = async (req, res) => {
  try {
    const { lowStock } = req.query;
    const query = {};
    if (lowStock === 'true') query.isLowStock = true;

    const items = await Inventory.find(query).sort('ingredient');
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add inventory item
// @route   POST /api/inventory
exports.addInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
exports.updateInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
exports.deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    res.status(200).json({ success: true, message: 'Inventory item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Restock inventory item
// @route   PUT /api/inventory/:id/restock
exports.restockItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    item.quantity += quantity;
    item.lastRestocked = new Date();
    await item.save();
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
