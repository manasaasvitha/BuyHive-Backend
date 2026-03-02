
const express = require("express");
const router = express.Router();
const Product = require("../model/Product");

// GET all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new product (optional, for admin use)
router.post("/products", async (req, res) => {
  const { name, price, image } = req.body;
  try {
    const newProduct = new Product({ name, price, image });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;



/*
const multer = require("multer");
const router = express.Router();
const Product = require("../model/Product");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const image = req.file?.filename;

    if (!name || !price || !category || !image) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const product = new Product({ name, price, category, image });
    await product.save();

    res.status(201).json({ success: true, message: "Product saved", product });
  } catch (err) {
    console.error("❌ Product Save Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
*/