const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    ingredient: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'g', 'l', 'ml', 'pcs', 'dozen', 'bunch'],
    },
    minimumStock: {
      type: Number,
      default: 10,
    },
    costPerUnit: {
      type: Number,
      default: 0,
    },
    supplier: {
      name: String,
      contact: String,
    },
    lastRestocked: Date,
    isLowStock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-set low stock flag
inventorySchema.pre('save', function (next) {
  this.isLowStock = this.quantity <= this.minimumStock;
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
