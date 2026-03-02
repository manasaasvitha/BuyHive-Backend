const express = require("express");
const router = express.Router();
const Cart = require("../model/CartItem");

// ✅ Add or Update Item in Cart
router.post("/cart", async (req, res) => {
  const { userEmail, productId, name, price, quantity, image } = req.body;

  try {
    const existing = await Cart.findOne({ userEmail, productId });

    if (existing) {
      existing.quantity = quantity;
      await existing.save();
    } else {
      const newItem = new Cart({ userEmail, productId, name, price, quantity, image });
      await newItem.save();
    }

    res.status(200).json({ success: true, message: "Item saved to cart" });
  } catch (err) {
    console.error("❌ Cart save error:", err);
    res.status(500).json({ success: false, message: "Failed to save cart item" });
  }
});

// ✅ Delete Item from Cart
router.delete("/cart/:userEmail/:productId", async (req, res) => {
  const { userEmail, productId } = req.params;

  try {
    await Cart.findOneAndDelete({ userEmail, productId });
    res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("❌ Failed to delete item:", err);
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});

// In cartRoutes.js
// GET /cart/:userEmail
router.get("/cart/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  try {
    const cartItems = await Cart.find({ userEmail });
    res.status(200).json({ cartItems });
  } catch (err) {
    console.error("Error fetching cart", err);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});



module.exports = router;
