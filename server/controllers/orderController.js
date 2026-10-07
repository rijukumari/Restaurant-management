const Order = require('../models/Order');
const Table = require('../models/Table');
const Payment = require('../models/Payment');

// @desc    Create order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, tableNumber, items, paymentMethod, notes, orderType } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = items.map((item) => {
      const customizationTotal = item.customizations
        ? item.customizations.reduce((sum, c) => sum + (c.priceModifier || 0), 0)
        : 0;
      const itemTotal = (item.price + customizationTotal) * item.quantity;
      subtotal += itemTotal;
      return {
        menuItem: item.menuItem,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customizations: item.customizations || [],
        specialInstructions: item.specialInstructions || '',
        itemTotal,
      };
    });

    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
    const totalAmount = subtotal + tax;

    // Find table
    let table = null;
    if (tableNumber) {
      table = await Table.findOne({ tableNumber });
      if (table) {
        table.status = 'occupied';
        await table.save();
      }
    }

    const order = await Order.create({
      customer: req.user ? req.user._id : undefined,
      customerName,
      customerPhone,
      customerEmail,
      table: table ? table._id : undefined,
      tableNumber,
      items: orderItems,
      subtotal,
      tax,
      totalAmount,
      paymentMethod: paymentMethod || 'counter',
      notes,
      orderType: orderType || 'dine_in',
      statusHistory: [{ status: 'pending', timestamp: new Date() }],
    });

    // Create payment record
    await Payment.create({
      order: order._id,
      customer: req.user ? req.user._id : undefined,
      amount: totalAmount,
      method: paymentMethod || 'counter',
      status: paymentMethod === 'counter' ? 'pending' : 'pending',
    });

    const populated = await Order.findById(order._id)
      .populate('table', 'tableNumber')
      .populate('items.menuItem', 'name image');

    // Emit socket event for real-time
    const io = req.app.get('io');
    if (io) {
      io.emit('newOrder', populated);
    }

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const { status, date, search } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query)
      .populate('table', 'tableNumber')
      .populate('customer', 'name email')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('table', 'tableNumber')
      .populate('customer', 'name email phone')
      .populate('items.menuItem', 'name image');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by order number (public)
// @route   GET /api/orders/track/:orderNumber
exports.trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('table', 'tableNumber')
      .populate('items.menuItem', 'name image');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      updatedBy: req.user ? req.user._id : undefined,
    });

    // If completed/cancelled, free the table
    if (['completed', 'cancelled'].includes(status) && order.table) {
      await Table.findByIdAndUpdate(order.table, { status: 'cleaning' });
    }

    // If served, update payment
    if (status === 'served') {
      await Payment.findOneAndUpdate(
        { order: order._id },
        { status: 'paid' }
      );
      order.paymentStatus = 'paid';
    }

    await order.save();

    const populated = await Order.findById(order._id)
      .populate('table', 'tableNumber')
      .populate('items.menuItem', 'name image');

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('orderStatusUpdate', { orderId: order._id, status, order: populated });
    }

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get customer orders
// @route   GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('table', 'tableNumber')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get kitchen orders (active)
// @route   GET /api/orders/kitchen
exports.getKitchenOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ['pending', 'confirmed', 'preparing'] },
    })
      .populate('table', 'tableNumber')
      .sort('createdAt');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's stats
// @route   GET /api/orders/stats/today
exports.getTodayStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const totalRevenue = todayOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = todayOrders.length;
    const activeOrders = todayOrders.filter((o) =>
      ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
    ).length;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        activeOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
