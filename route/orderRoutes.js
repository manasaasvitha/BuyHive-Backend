const express = require("express");
const router = express.Router();
const Order = require("../model/Order");
const Cart = require("../model/CartItem");
const sendEmail = require("../utils/mailer");

// ===============================
// ✅ PLACE ORDER (Cart → Order)
// ===============================
router.post("/place-order", async (req, res) => {
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ success: false, message: "User email is required" });
  }

  try {
    const items = await Cart.find({ userEmail });

    if (!items.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // ✅ Calculate total
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // ✅ Create Order
    const newOrder = new Order({
      userEmail,
      products: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      createdAt: new Date(),
    });

    await newOrder.save();

    // ✅ Clear Cart
    await Cart.deleteMany({ userEmail });

    // ===============================
    // 📧 EMAIL CONTENT
    // ===============================
    const htmlContent = `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color: #4CAF50;">🧾 Order Confirmation - BuyHive</h2>
      <p><strong>User Email:</strong> ${userEmail}</p>

      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr style="background:#f8f8f8;">
            <th style="border:1px solid #ddd; padding:10px;">Product</th>
            <th style="border:1px solid #ddd; padding:10px;">Qty</th>
            <th style="border:1px solid #ddd; padding:10px;">Price</th>
            <th style="border:1px solid #ddd; padding:10px;">Total</th>
          </tr>
        </thead>

        <tbody>
          ${items
            .map(
              (item) => `
            <tr>
              <td style="border:1px solid #ddd; padding:10px;">${item.name}</td>
              <td style="border:1px solid #ddd; padding:10px;">${item.quantity}</td>
              <td style="border:1px solid #ddd; padding:10px;">₹${item.price}</td>
              <td style="border:1px solid #ddd; padding:10px;">₹${
                item.price * item.quantity
              }</td>
            </tr>
          `
            )
            .join("")}

          <tr style="background:#e8f5e9; font-weight:bold;">
            <td colspan="3" style="text-align:right; padding:10px;">
              Grand Total:
            </td>
            <td style="padding:10px;">₹${totalAmount}</td>
          </tr>
        </tbody>
      </table>

      <p>Thank you for shopping with BuyHive 😊</p>
    </div>
    `;

    // ===============================
    // 📩 SEND EMAIL TO USER + ADMIN
    // ===============================

    try {
      // Send to User
      await sendEmail(
        userEmail,
        "🧾 Your Order Confirmation - BuyHive",
        htmlContent
      );

      // Send to Admin
      await sendEmail(
        process.env.ADMIN_EMAIL,
        `📥 New Order Received from ${userEmail}`,
        htmlContent
      );

      console.log("✅ Emails sent to user & admin");
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError.message);
    }

    return res
      .status(200)
      .json({ success: true, message: "Order placed and emails sent" });

  } catch (err) {
    console.error("❌ Order placement failed:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===============================
// ✅ GET USER ORDERS
// ===============================
router.get("/:email", async (req, res) => {
  try {
    const orders = await Order.find({
      userEmail: req.params.email,
    }).sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;