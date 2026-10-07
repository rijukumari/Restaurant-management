const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    image: {
      public_id: String,
      url: { type: String, default: '' },
    },
    ingredients: [String],
    calories: {
      type: Number,
      min: 0,
    },
    isVeg: {
      type: Boolean,
      default: false,
    },
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'extra_hot'],
      default: 'mild',
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number, // in minutes
      default: 20,
    },
    customizations: [
      {
        name: String,
        options: [
          {
            label: String,
            priceModifier: { type: Number, default: 0 },
          },
        ],
      },
    ],
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
