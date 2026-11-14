const express = require("express");
const Order = require("../models/Order");
const userAuth = require("../middleware/userAuth");

const router = express.Router();

// MOCK / COD PAYMENT
router.post("/pay", userAuth, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔁 MOCK PAYMENT SUCCESS
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "Paid",
      paymentMethod: "Mock",
      paymentId: "MOCK_" + Date.now(),
    });

    res.json({
      message: "Payment successful (Mock mode)",
      orderId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
