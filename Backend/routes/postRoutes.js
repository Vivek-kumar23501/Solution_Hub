import express from "express";
import Post from "../Models/Post.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create Post
router.post("/create", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // from JWT token
    const image = req.file ? req.file.filename : null;

    const newPost = new Post({ title, description, userId, image });
    await newPost.save();

    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ success: false, message: "Post creation failed" });
  }
});

// Get All Posts (populate user info)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
});

export default router;
