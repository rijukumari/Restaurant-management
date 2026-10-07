const Table = require('../models/Table');
const QRCode = require('qrcode');

// @desc    Get all tables
// @route   GET /api/tables
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort('tableNumber');
    res.status(200).json({ success: true, count: tables.length, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single table
// @route   GET /api/tables/:id
exports.getTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create table
// @route   POST /api/tables
exports.createTable = async (req, res) => {
  try {
    const { tableNumber, capacity, location } = req.body;

    // Generate QR code URL
    const menuUrl = `${process.env.CLIENT_URL}/menu/table/${tableNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#0B0B0B', light: '#F7F2E8' },
    });

    const table = await Table.create({
      tableNumber,
      capacity,
      location,
      qrCode: qrCodeDataUrl,
      qrUrl: menuUrl,
    });

    res.status(201).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update table
// @route   PUT /api/tables/:id
exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    res.status(200).json({ success: true, message: 'Table deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate/Regenerate QR code for a table
// @route   POST /api/tables/:id/qr
exports.generateQR = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }

    const menuUrl = `${process.env.CLIENT_URL}/menu/table/${table.tableNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#0B0B0B', light: '#F7F2E8' },
    });

    table.qrCode = qrCodeDataUrl;
    table.qrUrl = menuUrl;
    await table.save();

    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update table status
// @route   PUT /api/tables/:id/status
exports.updateTableStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get table by number (public - for QR scan)
// @route   GET /api/tables/number/:tableNumber
exports.getTableByNumber = async (req, res) => {
  try {
    const table = await Table.findOne({ tableNumber: req.params.tableNumber });
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' });
    }
    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
