const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');

// In-memory fallback dataset for offline/dev resilience
let fallbackInventory = [
  {
    _id: 'inv_001',
    ingredient: 'Japanese A5 Wagyu Tenderloin',
    quantity: 14.5,
    unit: 'kg',
    minimumStock: 8.0,
    costPerUnit: 18500,
    supplier: { name: 'Miyazaki Kobe Imports', contact: '+81 3 5555 0192' },
    lastRestocked: new Date(Date.now() - 86400000 * 2),
    isLowStock: false,
    createdAt: new Date(),
  },
  {
    _id: 'inv_002',
    ingredient: 'Périgord Black Truffle (Fresh)',
    quantity: 0.85,
    unit: 'kg',
    minimumStock: 1.2,
    costPerUnit: 42000,
    supplier: { name: 'Maison de la Truffe France', contact: '+33 1 42 68 01 00' },
    lastRestocked: new Date(Date.now() - 86400000 * 6),
    isLowStock: true,
    createdAt: new Date(),
  },
  {
    _id: 'inv_003',
    ingredient: 'Imperial Royal Beluga Caviar',
    quantity: 6,
    unit: 'pcs',
    minimumStock: 10,
    costPerUnit: 12500,
    supplier: { name: 'Caspian Heritage Seafarms', contact: '+971 4 332 9901' },
    lastRestocked: new Date(Date.now() - 86400000 * 5),
    isLowStock: true,
    createdAt: new Date(),
  },
  {
    _id: 'inv_004',
    ingredient: 'Valrhona Grand Cru Dark Chocolate 70%',
    quantity: 28,
    unit: 'kg',
    minimumStock: 15,
    costPerUnit: 2400,
    supplier: { name: 'Valrhona Pâtisserie Direct', contact: '+33 4 75 07 90 90' },
    lastRestocked: new Date(Date.now() - 86400000 * 1),
    isLowStock: false,
    createdAt: new Date(),
  },
  {
    _id: 'inv_005',
    ingredient: 'Normandy Beurre d\'Isigny AOP Butter',
    quantity: 22,
    unit: 'kg',
    minimumStock: 10,
    costPerUnit: 950,
    supplier: { name: 'Isigny Sainte-Mère Laiterie', contact: '+33 2 31 51 33 33' },
    lastRestocked: new Date(Date.now() - 86400000 * 3),
    isLowStock: false,
    createdAt: new Date(),
  },
  {
    _id: 'inv_006',
    ingredient: 'Kashmiri Mogra Grade Saffron',
    quantity: 0.25,
    unit: 'kg',
    minimumStock: 0.5,
    costPerUnit: 68000,
    supplier: { name: 'Pampore Golden Spice Guild', contact: '+91 1933 222104' },
    lastRestocked: new Date(Date.now() - 86400000 * 12),
    isLowStock: true,
    createdAt: new Date(),
  },
  {
    _id: 'inv_007',
    ingredient: 'San Marzano DOP Organic Tomatoes',
    quantity: 45,
    unit: 'kg',
    minimumStock: 20,
    costPerUnit: 380,
    supplier: { name: 'Agro Sarnese Vesuviano', contact: '+39 081 928312' },
    lastRestocked: new Date(Date.now() - 86400000 * 4),
    isLowStock: false,
    createdAt: new Date(),
  },
  {
    _id: 'inv_008',
    ingredient: 'Champagne Dom Pérignon Vintage Reserve',
    quantity: 18,
    unit: 'pcs',
    minimumStock: 12,
    costPerUnit: 24500,
    supplier: { name: 'Moët Hennessy Cellars', contact: '+33 3 26 51 20 00' },
    lastRestocked: new Date(Date.now() - 86400000 * 7),
    isLowStock: false,
    createdAt: new Date(),
  }
];

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// @desc    Get all inventory items
// @route   GET /api/inventory
exports.getInventory = async (req, res) => {
  try {
    const { lowStock } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (lowStock === 'true') query.isLowStock = true;
      const items = await Inventory.find(query).sort('ingredient');
      return res.status(200).json({ success: true, count: items.length, data: items });
    }

    let items = [...fallbackInventory];
    if (lowStock === 'true') {
      items = items.filter(item => item.isLowStock);
    }
    return res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add inventory item
// @route   POST /api/inventory
exports.addInventoryItem = async (req, res) => {
  try {
    const { ingredient, quantity, unit, minimumStock = 10, costPerUnit = 0, supplier } = req.body;

    if (isDbConnected()) {
      const item = await Inventory.create(req.body);
      return res.status(201).json({ success: true, data: item });
    }

    const newItem = {
      _id: `inv_${Date.now()}`,
      ingredient,
      quantity: Number(quantity),
      unit: unit || 'kg',
      minimumStock: Number(minimumStock),
      costPerUnit: Number(costPerUnit),
      supplier: typeof supplier === 'string' ? { name: supplier, contact: '' } : supplier || { name: 'Lumière Vault', contact: '' },
      isLowStock: Number(quantity) <= Number(minimumStock),
      lastRestocked: new Date(),
      createdAt: new Date(),
    };

    fallbackInventory.unshift(newItem);
    return res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
exports.updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const item = await Inventory.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) {
        return res.status(404).json({ success: false, message: 'Inventory item not found' });
      }
      return res.status(200).json({ success: true, data: item });
    }

    const index = fallbackInventory.findIndex(item => item._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    const current = fallbackInventory[index];
    const updated = {
      ...current,
      ...req.body,
      _id: current._id,
    };
    if (updated.quantity !== undefined && updated.minimumStock !== undefined) {
      updated.isLowStock = Number(updated.quantity) <= Number(updated.minimumStock);
    }
    fallbackInventory[index] = updated;

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
exports.deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const item = await Inventory.findByIdAndDelete(id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Inventory item not found' });
      }
      return res.status(200).json({ success: true, message: 'Inventory item deleted' });
    }

    const index = fallbackInventory.findIndex(item => item._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    fallbackInventory.splice(index, 1);
    return res.status(200).json({ success: true, message: 'Inventory item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Restock inventory item
// @route   PUT /api/inventory/:id/restock
exports.restockItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (isDbConnected()) {
      const item = await Inventory.findById(id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Inventory item not found' });
      }
      item.quantity += Number(quantity);
      item.lastRestocked = new Date();
      await item.save();
      return res.status(200).json({ success: true, data: item });
    }

    const item = fallbackInventory.find(i => i._id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    item.quantity = Number(item.quantity) + Number(quantity);
    item.isLowStock = item.quantity <= item.minimumStock;
    item.lastRestocked = new Date();

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
