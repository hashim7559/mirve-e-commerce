const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    enum: ["S", "M", "L", "XL", "XXL"],
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
    },
    variants: {
      type: [variantSchema],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
