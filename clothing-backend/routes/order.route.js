const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userAuth = require("../middleware/userAuth");
const Order = require("../models/Order");
const Product = require("../models/Product");


// CREATE ORDER
router.post("/", userAuth, async (req, res) => {
  try {
    const { customerName, phone, address,pincode, items, totalAmount } = req.body;

    if (!customerName || !phone || !address || !pincode || !items || !totalAmount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1️⃣ CHECK & REDUCE STOCK
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const variant = product.variants.find(
        v => v.size === item.size
      );

      if (!variant) {
        return res.status(400).json({
          message: `Size ${item.size} not available`
        });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          message: `Only ${variant.stock} left for size ${item.size}`
        });
      }

      // ✅ Reduce stock
      variant.stock -= item.quantity;
      await product.save();
    }

    // 2️⃣ CREATE ORDER (ONLY AFTER STOCK SUCCESS)
    const order = new Order({
      userId: req.user.userId,
      customerName,
      phone,
      address,
      pincode,
      items,
      totalAmount,
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// GET ALL ORDERS (ADMIN)
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE ORDER STATUS (ADMIN)
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Placed", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET LOGGED-IN USER ORDERS
router.get("/my", userAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
