/*
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const generateToken = require("../utils/generateToken");

router.post("/login", async (req, res) => {
    console.log(req.body);
    
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({ success: false, message: "Invalid password" });
    // }

    const token = generateToken();

    // ✅ Check and assign token
    user.token = token;
    await user.save();

    // ✅ Return full user data including token
    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        token: user.token,
      },
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/logout", async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });
    if (user) {
      user.token = null;
      await user.save();
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
*/

// auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const generateToken = require("../utils/generateToken");

// ==================== POST /signup ====================
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      token: null,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ success: false, message: "Server error during signup" });
  }
});

// ==================== POST /login ====================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = generateToken(); // random token
    user.token = token;
    await user.save();

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        token: user.token,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

// ==================== POST /logout ====================
router.post("/logout", async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });
    if (user) {
      user.token = null;
      await user.save();
    }
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({ success: false, message: "Server error during logout" });
  }
});

module.exports = router;