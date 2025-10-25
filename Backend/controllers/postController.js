import Post from "../Models/Post.js";

export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // from auth middleware
    const image = req.file ? req.file.filename : null;

    const newPost = new Post({ title, description, userId, image });
    await newPost.save();

    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Post creation failed" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
};
