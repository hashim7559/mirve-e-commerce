const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/health", require("./routes/health.route"));

// Root route
app.get("/", (req, res) => {
  res.send("Clothing Store API Running");
});

module.exports = app;

app.use("/api/products", require("./routes/product.route"));

app.use("/api/orders", require("./routes/order.route"));

app.use("/api/admin", require("./routes/admin.route"));

app.use("/api/users", require("./routes/user.route"));

app.use("/api/payment", require("./routes/payment.route"));