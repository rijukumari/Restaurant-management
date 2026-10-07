const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Email is required'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    date: {
      type: Date,
      required: [true, 'Reservation date is required'],
    },
    time: {
      type: String,
      required: [true, 'Reservation time is required'],
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest required'],
      max: [20, 'Maximum 20 guests'],
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
      default: 'pending',
    },
    specialRequests: String,
    occasion: {
      type: String,
      enum: ['none', 'birthday', 'anniversary', 'business', 'date', 'celebration', 'other'],
      default: 'none',
    },
  },
  { timestamps: true }
);

reservationSchema.index({ date: 1, time: 1, table: 1 });
reservationSchema.index({ status: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
