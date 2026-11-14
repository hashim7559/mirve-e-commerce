const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const User = require("../models/User");
const upload = require("../middleware/upload");


// ADMIN LOGIN
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





// ADD PRODUCT (ADMIN)
router.post("/products", auth,upload.array("images",5), async (req, res) => {
  console.log("🔥 ADD PRODUCT ROUTE HIT");
  console.log("FILES:", req.files);
  try {
    const { name, category, price, description } = req.body;

    const variants = JSON.parse(req.body.variants);

    const images = req.files.map(file => file.path);

    if(!variants || variants.length === 0) {
      return res.status(400).json({
        message:"At least one variant (size & stock) is required"
      });
    }
    const product = new Product({
      name,
      category,
      price,
      description,
      images: images,
      variants
    });

    await product.save();
    res.json({ message: "Product added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL PRODUCTS (ADMIN)
router.get("/products", auth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// UPDATE PRODUCT (ADMIN)
router.put("/products/:id", auth, async (req, res) => {
  try {
    const { price, description, variants } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (variants !== undefined) product.variants = variants;

    await product.save();

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE PRODUCT
router.delete("/products/:id", auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// VIEW USERS (ADMIN)
router.get("/users", auth, async (req, res) => {
  const users = await User.find().select("name email createdAt");
  res.json(users);
});


module.exports = router;



