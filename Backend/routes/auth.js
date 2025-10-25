import express from "express";
import User from "../Models/User.js";
import PendingUser from "../Models/PendingUser.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const router = express.Router();

let otpStore = {}; // Temporary OTP storage
let forgotOtpStore = {}; // Temporary store for forgot password OTPs

// ----------------------
// Send OTP for Signup
// ----------------------
router.post("/send-otp", async (req, res) => {
  const { name, email, mobile } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const existingPending = await PendingUser.findOne({ email });
    if (existingUser || existingPending) 
      return res.status(400).json({ message: "Email already registered or pending!" });

    const otp = Math.floor(1000 + Math.random() * 9000);
    otpStore[email] = { otp, name, mobile };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "OTP for Signup",
      text: `Hello ${name}, your OTP is ${otp}`,
    });

    res.json({ success: true, message: "OTP sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// ----------------------
// Verify OTP and save pending user
// ----------------------
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) 
    return res.status(400).json({ success: false, message: "OTP expired or not requested" });

  if (otpStore[email].otp == otp) {
    const { name, mobile } = otpStore[email];

    let pending = await PendingUser.findOne({ email });
    if (!pending) {
      pending = new PendingUser({ name, email, mobile, otpVerified: true });
      await pending.save();
    }

    res.json({ success: true, message: "OTP verified!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

// ----------------------
// Register user after OTP verification
// ----------------------
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser || !pendingUser.otpVerified) {
      return res.status(400).json({ success: false, message: "OTP not verified!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Move to User collection
    const newUser = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      mobile: pendingUser.mobile,
      password: hashedPassword,
      role: role || "user", // default role is user
    });

    await newUser.save();

    // Delete from pending
    await PendingUser.deleteOne({ email });

    res.json({ success: true, message: "Account created successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});

// ----------------------
// Login Route
// ----------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const pending = await PendingUser.findOne({ email });
      if (pending) return res.status(400).json({ success: false, message: "Account pending, please complete password setup." });
      return res.status(400).json({ success: false, message: "User not found. Please signup." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// ----------------------
// Forgot Password - Send OTP
// ----------------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Email not registered!" });

    const otp = Math.floor(1000 + Math.random() * 9000);
    forgotOtpStore[email] = { otp, timestamp: Date.now() };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}`,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
});

// ----------------------
// Forgot Password - Verify OTP
// ----------------------
router.post("/forgot-password/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const record = forgotOtpStore[email];
  if (!record) return res.status(400).json({ success: false, message: "OTP not requested or expired" });

  if (record.otp == otp) {
    res.json({ success: true, message: "OTP verified" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

// ----------------------
// Forgot Password - Reset
// ----------------------
router.put("/forgot-password/reset", async (req, res) => {
  const { email, password } = req.body;

  if (!forgotOtpStore[email]) {
    return res.status(400).json({ success: false, message: "OTP not verified" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { $set: { password: hashedPassword } });

    delete forgotOtpStore[email];

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating password" });
  }
});

export default router;
