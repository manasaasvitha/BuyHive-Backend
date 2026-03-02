const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../utils/cloudinaryStorage");
const Product = require("../model/Product");

// ✅ Use Cloudinary storage
const upload = multer({ storage });


// ============================
// ✅ ADD PRODUCT WITH IMAGE
// ============================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);   // 👈 ADD THIS

    const { name, price, description, brand } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // 🔥 IMPORTANT — GET CLOUDINARY URL
    const imageUrl = req.file.path;

    console.log("Cloudinary URL:", imageUrl); // 👈 ADD THIS

    const newProduct = new Product({
      name,
      price,
      description,
      brand,
      image: imageUrl,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });

  } catch (err) {
    console.error("❌ Product upload error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ============================
// ✅ GET ALL PRODUCTS
// ============================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.json({
      success: true,
      products,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
    });
  }
});


// ============================
// ✅ GET PRODUCT BY ID
// ============================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;