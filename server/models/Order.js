const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  customizations: [
    {
      name: String,
      selected: String,
      priceModifier: { type: Number, default: 0 },
    },
  ],
  specialInstructions: String,
  itemTotal: Number,
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
    },
    customerPhone: String,
    customerEmail: String,
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
    },
    tableNumber: Number,
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'counter', 'card', 'cash'],
      default: 'counter',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    orderType: {
      type: String,
      enum: ['dine_in', 'takeaway'],
      default: 'dine_in',
    },
    notes: String,
    estimatedTime: Number, // in minutes
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  { timestamps: true }
);

// Generate unique order number before save
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const prefix = 'LUM';
    const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `${prefix}-${datePart}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ table: 1 });

module.exports = mongoose.model('Order', orderSchema);
