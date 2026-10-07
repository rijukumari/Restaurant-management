const User = require('../models/User');

// @desc    Get all staff
// @route   GET /api/staff
exports.getStaff = async (req, res) => {
  try {
    const staff = await User.find({
      role: { $in: ['manager', 'chef', 'kitchen_staff', 'waiter', 'cashier'] },
    }).sort('name');
    res.status(200).json({ success: true, count: staff.length, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add staff
// @route   POST /api/staff
exports.addStaff = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const validRoles = ['manager', 'chef', 'kitchen_staff', 'waiter', 'cashier'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid staff role' });
    }

    const user = await User.create({ name, email, phone, password, role });
    res.status(201).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, isActive: user.isActive },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update staff
// @route   PUT /api/staff/:id
exports.updateStaff = async (req, res) => {
  try {
    const { name, phone, role, isActive } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete staff
// @route   DELETE /api/staff/:id
exports.deleteStaff = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    res.status(200).json({ success: true, message: 'Staff member deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all customers
// @route   GET /api/users/customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).sort('-createdAt');
    res.status(200).json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
