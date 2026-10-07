const Payment = require('../models/Payment');
const Order = require('../models/Order');

// @desc    Get all payments
// @route   GET /api/payments
exports.getPayments = async (req, res) => {
  try {
    const { status, method, date } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (method) query.method = method;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    const payments = await Payment.find(query)
      .populate('order', 'orderNumber totalAmount customerName')
      .populate('customer', 'name email')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update payment status
// @route   PUT /api/payments/:id
exports.updatePayment = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('order', 'orderNumber totalAmount');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Sync payment status to order
    if (status === 'paid') {
      await Order.findByIdAndUpdate(payment.order._id, { paymentStatus: 'paid' });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    // In production, verify signature with Razorpay
    // const crypto = require('crypto');
    // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    //   .update(razorpayOrderId + '|' + razorpayPaymentId)
    //   .digest('hex');

    // Update payment
    const payment = await Payment.findOneAndUpdate(
      { order: orderId },
      {
        status: 'paid',
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      },
      { new: true }
    );

    // Update order payment status
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid',
      razorpayOrderId,
      razorpayPaymentId,
    });

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
