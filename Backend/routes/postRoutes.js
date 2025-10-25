import express from "express";
import Post from "../Models/Post.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

// --------------------
// Multer Setup
// --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif/;
  const allowedVideoTypes = /mp4|mov|avi|mkv/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedImageTypes.test(ext) || allowedVideoTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images or videos are allowed"));
  }
};

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter }); // max 50MB

// --------------------
// Router Setup
// --------------------
const router = express.Router();

// Helper function to handle creation
const createPostHandler = async (req, res, type) => {
  try {
    const { description } = req.body;
    const userId = req.user.id;

    const image = req.files?.image ? req.files.image[0].filename : null;
    const video = req.files?.video ? req.files.video[0].filename : null;

    const newPost = new Post({ userId, description, image, video, type });
    await newPost.save();

    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    console.error(`Error creating ${type}:`, err);
    res.status(500).json({ success: false, message: `${type} creation failed` });
  }
};

// --------------------
// Create Post Route
// --------------------
router.post(
  "/create-post",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => createPostHandler(req, res, "Post")
);

// --------------------
// Create Doubt Route
// --------------------
router.post(
  "/create-doubt",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req, res) => createPostHandler(req, res, "Doubt")
);

// --------------------
// Get all posts and doubts for a user
// --------------------
router.get("/user/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ userId }).sort({ createdAt: -1 }); // newest first
    res.json({ success: true, posts });
  } catch (err) {
    console.error("Fetch User Posts Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
});

// --------------------
// Get all posts (feed)
// --------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email"); // populate user info
    res.json({ success: true, posts });
  } catch (err) {
    console.error("Fetch All Posts Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
});
// --------------------
// Get post count for a user
// --------------------
router.get("/count/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const postCount = await Post.countDocuments({ userId });
    res.json({ success: true, count: postCount });
  } catch (err) {
    console.error("Fetch Post Count Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch post count" });
  }
});
export default router;
