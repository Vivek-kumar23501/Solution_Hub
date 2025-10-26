import express from "express";
import User from "../Models/User.js";
import PendingUser from "../Models/PendingUser.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";


// Helper function to get full URL of profile picture
const getProfilePictureUrl = (req, filename) => {
  if (!filename) return "";
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};


dotenv.config();
const router = express.Router();

// Temporary OTP stores
let otpStore = {};
let forgotOtpStore = {};

// ---------------------
// Multer setup for profile picture
// ---------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// ==============================
// Send OTP for Signup
// ==============================
router.post("/send-otp", async (req, res) => {
  const { name, email, mobile } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const existingPending = await PendingUser.findOne({ email });

    if (existingUser || existingPending) {
      return res.status(400).json({ success: false, message: "Email already registered or pending!" });
    }

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
    console.error("Send OTP Error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// ==============================
// Verify OTP
// ==============================
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.status(400).json({ success: false, message: "OTP expired or not requested" });
  }

  if (otpStore[email].otp == otp) {
    const { name, mobile } = otpStore[email];

    let pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      pendingUser = new PendingUser({ name, email, mobile, otpVerified: true });
      await pendingUser.save();
    } else {
      pendingUser.otpVerified = true;
      await pendingUser.save();
    }

    res.json({ success: true, message: "OTP verified!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});
// register 
router.post("/register", upload.single("profilePic"), async (req, res) => {
  const { email, password, role, bio, location } = req.body;

  try {
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser || !pendingUser.otpVerified) {
      return res.status(400).json({ success: false, message: "OTP not verified!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      mobile: pendingUser.mobile,
      password: hashedPassword,
      role: role || "user",
      bio: bio || "",
      location: location || "",
      profilePicture: req.file ? req.file.filename : "", // store only filename
    });

    const savedUser = await newUser.save();
    await PendingUser.deleteOne({ email });

    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        bio: savedUser.bio,
        location: savedUser.location,
        profilePicture: getProfilePictureUrl(req, savedUser.profilePicture),
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});


// ==============================
// Login
// ==============================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        location: user.location,
        profilePicture: getProfilePictureUrl(req, user.profilePicture),
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});


// ==============================
// Forgot Password - Send OTP
// ==============================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Email not registered!" });
    }

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
    console.error("Forgot Password Error:", err);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
});

// ==============================
// Forgot Password - Verify OTP
// ==============================
router.post("/forgot-password/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = forgotOtpStore[email];

  if (!record) {
    return res.status(400).json({ success: false, message: "OTP not requested or expired" });
  }

  if (record.otp == otp) {
    res.json({ success: true, message: "OTP verified" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

// ==============================
// Forgot Password - Reset
// ==============================
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
    console.error("Reset Password Error:", err);
    res.status(500).json({ success: false, message: "Error updating password" });
  }
});


// ---------------------
// Get all users (except self and already friends / sent requests)
// ---------------------
router.get("/all-users", verifyToken, async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user.id);
    const excludeIds = [req.user.id, ...loggedInUser.friends, ...loggedInUser.sentRequests];

    const users = await User.find(
      { _id: { $nin: excludeIds } },
      { password: 0, friends: 0, friendRequests: 0, sentRequests: 0 }
    );

    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

// ---------------------
// Get received friend requests
// ---------------------
router.get("/friend-requests", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friendRequests", "name email");
    res.json({ success: true, friendRequests: user.friendRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch friend requests" });
  }
});

// ---------------------
// Get sent friend requests
// ---------------------
router.get("/sent-requests", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("sentRequests", "name email");
    res.json({ success: true, sentRequests: user.sentRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch sent requests" });
  }
});

// ---------------------
// Send friend request
// ---------------------
router.post("/send-friend-request/:id", verifyToken, async (req, res) => {
  try {
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(req.params.id);

    if (!receiver) return res.status(404).json({ success: false, message: "User not found" });

    if (receiver.friendRequests.includes(sender._id) || sender.sentRequests.includes(receiver._id))
      return res.status(400).json({ success: false, message: "Request already sent" });

    receiver.friendRequests.push(sender._id);
    sender.sentRequests.push(receiver._id);

    await receiver.save();
    await sender.save();

    res.json({ success: true, requestedUser: receiver, message: "Friend request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send friend request" });
  }
});

// ---------------------
// Accept friend request
// ---------------------
router.post("/accept-friend-request/:id", verifyToken, async (req, res) => {
  try {
    const receiver = await User.findById(req.user.id);
    const sender = await User.findById(req.params.id);

    if (!receiver.friendRequests.includes(sender._id))
      return res.status(400).json({ success: false, message: "No friend request from this user" });

    // Add to friends
    receiver.friends.push(sender._id);
    sender.friends.push(receiver._id);

    // Remove from requests
    receiver.friendRequests = receiver.friendRequests.filter((id) => !id.equals(sender._id));
    sender.sentRequests = sender.sentRequests.filter((id) => !id.equals(receiver._id));

    await receiver.save();
    await sender.save();

    res.json({ success: true, message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to accept friend request" });
  }
});



// ---------------------
// Get My Profile Data
// ---------------------
router.get("/my-profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password") // exclude password
      .populate("friends", "name email mobile profilePicture"); // include profilePicture for friends

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Convert user's profile picture to full URL
    const userData = {
      ...user.toObject(),
      profilePicture: getProfilePictureUrl(req, user.profilePicture),
      friends: user.friends.map(friend => ({
        ...friend.toObject(),
        profilePicture: getProfilePictureUrl(req, friend.profilePicture),
      })),
    };

    res.json({ success: true, user: userData });
  } catch (err) {
    console.error("Fetch Profile Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch profile data" });
  }
});


// DELETE a friend
router.delete("/remove-friend/:friendId", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.params;

  try {
    // Remove friendId from logged-in user's friends
    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });

    // Remove userId from friend's friends
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    res.json({ success: true, message: "Friend removed successfully" });
  } catch (err) {
    console.error("Remove Friend Error:", err);
    res.status(500).json({ success: false, message: "Failed to remove friend" });
  }
});





export default router;
