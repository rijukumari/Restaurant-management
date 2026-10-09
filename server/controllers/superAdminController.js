const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Reservation = require('../models/Reservation');
const MenuItem = require('../models/MenuItem');

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// Rich fallback store for offline/in-memory mode
let fallbackUsers = [
  {
    _id: 'usr_001',
    name: 'Antoine Laurent',
    email: 'admin@lumiere.com',
    role: 'admin',
    phone: '+33 1 44 21 00 01',
    isActive: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    _id: 'usr_002',
    name: 'Jean-Luc Picard',
    email: 'manager@lumiere.com',
    role: 'manager',
    phone: '+33 1 44 21 00 02',
    isActive: true,
    createdAt: new Date('2024-02-10'),
  },
  {
    _id: 'usr_003',
    name: 'Guillaume Vatel',
    email: 'chef@lumiere.com',
    role: 'chef',
    phone: '+33 1 44 21 00 03',
    isActive: true,
    createdAt: new Date('2024-02-18'),
  },
  {
    _id: 'usr_004',
    name: 'Sophie Moreau',
    email: 'sophie.m@lumiere.com',
    role: 'kitchen_staff',
    phone: '+33 1 44 21 00 04',
    isActive: true,
    createdAt: new Date('2024-03-01'),
  },
  {
    _id: 'usr_005',
    name: 'Lucas Bernard',
    email: 'lucas.b@lumiere.com',
    role: 'waiter',
    phone: '+33 1 44 21 00 05',
    isActive: true,
    createdAt: new Date('2024-03-12'),
  },
  {
    _id: 'usr_006',
    name: 'Camille Dupont',
    email: 'cashier@lumiere.com',
    role: 'cashier',
    phone: '+33 1 44 21 00 06',
    isActive: true,
    createdAt: new Date('2024-03-20'),
  },
  {
    _id: 'usr_007',
    name: 'Lord Alistair Sterling',
    email: 'sterling@mayfair.co.uk',
    role: 'customer',
    phone: '+44 20 7946 0912',
    isActive: true,
    createdAt: new Date('2024-04-05'),
  },
  {
    _id: 'usr_008',
    name: 'Elena Rostova',
    email: 'elena.rostova@geneva.ch',
    role: 'customer',
    phone: '+41 22 731 88 00',
    isActive: true,
    createdAt: new Date('2024-04-18'),
  },
  {
    _id: 'usr_009',
    name: 'Vikramaditya Roy',
    email: 'v.roy@heritage.in',
    role: 'customer',
    phone: '+91 98200 11223',
    isActive: true,
    createdAt: new Date('2024-04-22'),
  },
];

let fallbackOrders = [
  {
    orderNumber: 'LUM-1045',
    customerName: 'Aarav Sharma',
    status: 'preparing',
    totalAmount: 6400,
    createdAt: new Date(Date.now() - 1000 * 60 * 12),
  },
  {
    orderNumber: 'LUM-1044',
    customerName: 'Priya Mehta',
    status: 'ready',
    totalAmount: 3600,
    createdAt: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    orderNumber: 'LUM-1043',
    customerName: 'Vikramaditya Roy',
    status: 'delivered',
    totalAmount: 9100,
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    orderNumber: 'LUM-1042',
    customerName: 'Elena Rostova',
    status: 'delivered',
    totalAmount: 7800,
    createdAt: new Date(Date.now() - 1000 * 60 * 90),
  },
  {
    orderNumber: 'LUM-1041',
    customerName: 'Lord Sterling',
    status: 'delivered',
    totalAmount: 14200,
    createdAt: new Date(Date.now() - 1000 * 60 * 180),
  },
];

let fallbackReservations = [
  {
    name: 'Lady Vivienne Westwood',
    date: '2026-10-12',
    time: '20:00',
    partySize: 4,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    name: 'Lord Alistair Sterling',
    date: '2026-10-14',
    time: '19:30',
    partySize: 2,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    name: 'Dr. Hiroshi Tanaka',
    date: '2026-10-15',
    time: '21:00',
    partySize: 6,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 240),
  },
];

// @desc    Get system overview / dashboard stats
// @route   GET /api/super-admin/overview
exports.getSystemOverview = async (req, res) => {
  try {
    if (isDbConnected()) {
      const now = new Date();
      const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
      const monthStart = new Date(now); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);

      const [
        totalUsers,
        totalStaff,
        totalCustomers,
        totalOrders,
        todayOrders,
        monthOrders,
        totalInventory,
        lowStockItems,
        totalMenuItems,
        totalReservations,
        pendingReservations,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: { $in: ['admin', 'manager', 'chef', 'kitchen_staff', 'waiter', 'cashier'] } }),
        User.countDocuments({ role: 'customer' }),
        Order.countDocuments(),
        Order.countDocuments({ createdAt: { $gte: todayStart } }),
        Order.countDocuments({ createdAt: { $gte: monthStart } }),
        Inventory.countDocuments(),
        Inventory.countDocuments({ isLowStock: true }),
        MenuItem.countDocuments(),
        Reservation.countDocuments(),
        Reservation.countDocuments({ status: 'pending' }),
      ]);

      const todayRevenue = await Order.aggregate([
        { $match: { createdAt: { $gte: todayStart }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]);
      const monthRevenue = await Order.aggregate([
        { $match: { createdAt: { $gte: monthStart }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]);
      const totalRevenue = await Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]);

      const roleBreakdown = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      const recentOrders = await Order.find()
        .sort('-createdAt')
        .limit(5)
        .select('orderNumber status totalAmount createdAt customerName');

      const recentUsers = await User.find()
        .sort('-createdAt')
        .limit(5)
        .select('name email role createdAt isActive');

      return res.status(200).json({
        success: true,
        data: {
          users: { total: totalUsers, staff: totalStaff, customers: totalCustomers },
          orders: { total: totalOrders, today: todayOrders, thisMonth: monthOrders },
          revenue: {
            today: todayRevenue[0]?.total || 0,
            thisMonth: monthRevenue[0]?.total || 0,
            total: totalRevenue[0]?.total || 0,
          },
          inventory: { total: totalInventory, lowStock: lowStockItems },
          menu: { total: totalMenuItems },
          reservations: { total: totalReservations, pending: pendingReservations },
          roleBreakdown,
          recentOrders,
          recentUsers,
        },
      });
    }

    // Offline / In-memory fallback
    const totalUsers = fallbackUsers.length;
    const totalStaff = fallbackUsers.filter(u => u.role !== 'customer').length;
    const totalCustomers = fallbackUsers.filter(u => u.role === 'customer').length;

    const roleMap = {};
    fallbackUsers.forEach(u => {
      roleMap[u.role] = (roleMap[u.role] || 0) + 1;
    });
    const roleBreakdown = Object.entries(roleMap).map(([_id, count]) => ({ _id, count }));

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers, staff: totalStaff, customers: totalCustomers },
        orders: { total: 142, today: 28, thisMonth: 412 },
        revenue: {
          today: 124500,
          thisMonth: 1845000,
          total: 5420000,
        },
        inventory: { total: 8, lowStock: 3 },
        menu: { total: 32 },
        reservations: { total: 48, pending: 6 },
        roleBreakdown,
        recentOrders: fallbackOrders,
        recentUsers: fallbackUsers.slice(0, 5),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users with pagination & filters
// @route   GET /api/super-admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, isActive } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (role) query.role = role;
      if (isActive !== undefined) query.isActive = isActive === 'true';
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await User.countDocuments(query);
      const users = await User.find(query)
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select('-password');

      return res.status(200).json({
        success: true,
        count: users.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        data: users,
      });
    }

    // In-memory filter
    let filtered = [...fallbackUsers];
    if (role) filtered = filtered.filter(u => u.role === role);
    if (isActive !== undefined) {
      const boolVal = isActive === 'true';
      filtered = filtered.filter(u => u.isActive === boolVal);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + Number(limit));

    res.status(200).json({
      success: true,
      count: paginated.length,
      total,
      pages: Math.ceil(total / limit) || 1,
      currentPage: Number(page),
      data: paginated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role / status
// @route   PUT /api/super-admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { role, isActive, name, phone } = req.body;
    const { id } = req.params;

    if (isDbConnected()) {
      const updateData = {};
      if (role) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (name) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;

      const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).select('-password');

      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.status(200).json({ success: true, data: user });
    }

    const user = fallbackUsers.find(u => u._id === id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/super-admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user && req.user._id && req.user._id.toString() === id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    if (isDbConnected()) {
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.status(200).json({ success: true, message: 'User deleted successfully' });
    }

    const idx = fallbackUsers.findIndex(u => u._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'User not found' });

    fallbackUsers.splice(idx, 1);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new staff / admin user
// @route   POST /api/super-admin/users
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (isDbConnected()) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      const user = await User.create({ name, email, phone, password, role });
      return res.status(201).json({
        success: true,
        data: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, isActive: user.isActive },
      });
    }

    const existing = fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const newUser = {
      _id: `usr_${Date.now()}`,
      name,
      email,
      phone: phone || '',
      role: role || 'waiter',
      isActive: true,
      createdAt: new Date(),
    };
    fallbackUsers.unshift(newUser);

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get system activity log
// @route   GET /api/super-admin/activity
exports.getActivityLog = async (req, res) => {
  try {
    if (isDbConnected()) {
      const [recentOrders, recentReservations, recentUsers] = await Promise.all([
        Order.find().sort('-createdAt').limit(10).select('orderNumber status totalAmount createdAt customerName'),
        Reservation.find().sort('-createdAt').limit(10).select('name date time partySize status createdAt'),
        User.find().sort('-createdAt').limit(10).select('name email role isActive createdAt'),
      ]);

      return res.status(200).json({
        success: true,
        data: { recentOrders, recentReservations, recentUsers },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        recentOrders: fallbackOrders,
        recentReservations: fallbackReservations,
        recentUsers: fallbackUsers.slice(0, 8),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
