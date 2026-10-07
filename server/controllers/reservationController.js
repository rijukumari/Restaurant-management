const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// @desc    Create reservation
// @route   POST /api/reservations
exports.createReservation = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, date, time, guests, tableId, specialRequests, occasion } = req.body;

    // Check for double booking
    if (tableId) {
      const existing = await Reservation.findOne({
        table: tableId,
        date: new Date(date),
        time,
        status: { $in: ['pending', 'confirmed'] },
      });
      if (existing) {
        return res.status(400).json({ success: false, message: 'This table is already reserved for the selected date and time' });
      }
    }

    const reservation = await Reservation.create({
      customer: req.user ? req.user._id : undefined,
      customerName,
      customerEmail,
      customerPhone,
      date: new Date(date),
      time,
      guests,
      table: tableId || undefined,
      specialRequests,
      occasion: occasion || 'none',
    });

    const populated = await Reservation.findById(reservation._id).populate('table', 'tableNumber capacity');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations
exports.getReservations = async (req, res) => {
  try {
    const { status, date } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const reservations = await Reservation.find(query)
      .populate('table', 'tableNumber capacity')
      .populate('customer', 'name email')
      .sort('-date');

    res.status(200).json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    reservation.status = status;

    // If confirmed, mark table as reserved
    if (status === 'confirmed' && reservation.table) {
      await Table.findByIdAndUpdate(reservation.table, { status: 'reserved' });
    }
    // If cancelled, free the table
    if (status === 'cancelled' && reservation.table) {
      await Table.findByIdAndUpdate(reservation.table, { status: 'available' });
    }

    await reservation.save();

    const populated = await Reservation.findById(reservation._id).populate('table', 'tableNumber capacity');

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update reservation
// @route   PUT /api/reservations/:id
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('table', 'tableNumber capacity');
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete reservation
// @route   DELETE /api/reservations/:id
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    // Free table if was reserved
    if (reservation.table) {
      await Table.findByIdAndUpdate(reservation.table, { status: 'available' });
    }
    res.status(200).json({ success: true, message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's reservations count
// @route   GET /api/reservations/today/count
exports.getTodayCount = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const count = await Reservation.countDocuments({
      date: { $gte: today, $lt: tomorrow },
      status: { $in: ['pending', 'confirmed'] },
    });
    res.status(200).json({ success: true, data: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
