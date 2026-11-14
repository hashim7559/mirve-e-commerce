const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        size: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Placed",
    },

    paymentStatus: {
      type: String,
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      default: "None",
    },
    paymentId: {
      type: String,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
