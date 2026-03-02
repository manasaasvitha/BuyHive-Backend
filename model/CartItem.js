
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  userEmail: String,
  productId: mongoose.Schema.Types.String,
  name: String,
  price: Number,
  quantity: Number,
  image: String,
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CartItem", cartItemSchema);
