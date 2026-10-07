const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items (public)
// @route   GET /api/menu
exports.getMenuItems = async (req, res) => {
  try {
    const { category, search, isVeg, minPrice, maxPrice, available } = req.query;
    const query = {};

    if (category) query.category = category;
    if (isVeg !== undefined) query.isVeg = isVeg === 'true';
    if (available !== undefined) query.isAvailable = available === 'true';
    else query.isAvailable = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const items = await MenuItem.find(query).populate('category', 'name').sort('-isBestseller -createdAt');
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    // Fallback if text index search fails
    if (error.message.includes('text index')) {
      const { category, isVeg, minPrice, maxPrice, search } = req.query;
      const query = { isAvailable: true };
      if (category) query.category = category;
      if (isVeg !== undefined) query.isVeg = isVeg === 'true';
      if (search) query.name = { $regex: search, $options: 'i' };
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      const items = await MenuItem.find(query).populate('category', 'name').sort('-isBestseller -createdAt');
      return res.status(200).json({ success: true, count: items.length, data: items });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
exports.getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('category', 'name');
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create menu item
// @route   POST /api/menu
exports.createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    const populated = await item.populate('category', 'name');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.status(200).json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bestsellers
// @route   GET /api/menu/bestsellers
exports.getBestsellers = async (req, res) => {
  try {
    const items = await MenuItem.find({ isBestseller: true, isAvailable: true })
      .populate('category', 'name')
      .limit(8);
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
