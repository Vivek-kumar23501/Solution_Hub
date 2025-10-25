import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // filename of uploaded image
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema);
