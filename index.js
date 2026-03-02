require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./route/auth");
const cartRoutes = require("./route/cartRoutes");
const productRoutes = require("./route/productRoutes");
const orderRoutes = require("./route/orderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;


// =========================
// ✅ Middleware
// =========================
app.use(cors({
  origin: "https://buyhive-frontend1.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =========================
// ✅ Connect MongoDB (ONLY ONCE)
// =========================
connectDB();


// =========================
// ✅ Routes
// =========================

// Auth (Signup/Login)
app.use("/", authRoutes);

// Products (Cloudinary upload)
app.use("/products", productRoutes);

// Cart
app.use("/", cartRoutes);

// Orders
app.use("/orders", orderRoutes);


// =========================
// ✅ Test Route
// =========================
app.get("/", (req, res) => {
  res.send("🚀 BuyHive Backend is running");
});


// =========================
// ✅ Start Server
// =========================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});