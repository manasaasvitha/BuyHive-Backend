/*
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});

module.exports = mongoose.model("Product", productSchema);
*/

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // path to uploaded image
  description: { type: String, default: "No description available." },
  brand: { type: String, required: true } 
});

module.exports = mongoose.model("Product", productSchema);
