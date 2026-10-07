const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Reservation = require('../models/Reservation');

// @desc    Get sales report
// @route   GET /api/reports/sales
exports.getSalesReport = async (req, res) => {
  try {
    const { period = 'daily', startDate, endDate } = req.query;

    let start, end;
    const now = new Date();

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      switch (period) {
        case 'weekly':
          start = new Date(now);
          start.setDate(start.getDate() - 7);
          break;
        case 'monthly':
          start = new Date(now);
          start.setMonth(start.getMonth() - 1);
          break;
        default: // daily
          start = new Date(now);
          start.setHours(0, 0, 0, 0);
      }
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
    }

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      status: { $ne: 'cancelled' },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Daily breakdown
    const dailyData = {};
    orders.forEach((order) => {
      const day = order.createdAt.toISOString().split('T')[0];
      if (!dailyData[day]) {
        dailyData[day] = { date: day, revenue: 0, orders: 0 };
      }
      dailyData[day].revenue += order.totalAmount;
      dailyData[day].orders += 1;
    });

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        dailyBreakdown: Object.values(dailyData),
        period,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get popular items
// @route   GET /api/reports/popular-items
exports.getPopularItems = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: 'cancelled' } });

    const itemCounts = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.name || item.menuItem?.toString();
        if (!itemCounts[key]) {
          itemCounts[key] = { name: item.name, totalQuantity: 0, totalRevenue: 0 };
        }
        itemCounts[key].totalQuantity += item.quantity;
        itemCounts[key].totalRevenue += item.itemTotal || item.price * item.quantity;
      });
    });

    const popular = Object.values(itemCounts)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10);

    res.status(200).json({ success: true, data: popular });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get analytics overview
// @route   GET /api/reports/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Last 30 days orders
    const orders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo },
      status: { $ne: 'cancelled' },
    });

    // Revenue by day for chart
    const revenueByDay = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      revenueByDay[key] = { date: key, revenue: 0, orders: 0 };
    }

    orders.forEach((order) => {
      const key = order.createdAt.toISOString().split('T')[0];
      if (revenueByDay[key]) {
        revenueByDay[key].revenue += order.totalAmount;
        revenueByDay[key].orders += 1;
      }
    });

    // Category performance
    const categoryPerformance = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const cat = item.name ? item.name.charAt(0) : 'Other';
        if (!categoryPerformance[cat]) {
          categoryPerformance[cat] = { category: cat, revenue: 0, count: 0 };
        }
        categoryPerformance[cat].revenue += item.itemTotal || 0;
        categoryPerformance[cat].count += item.quantity;
      });
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders: orders.length,
        revenueChart: Object.values(revenueByDay),
        categoryPerformance: Object.values(categoryPerformance).slice(0, 8),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
