import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Post", "Doubt"], required: true }, // distinguishes between post or doubt
  description: { type: String, required: true },
  image: { type: String }, // optional image filename
  video: { type: String }, // optional video filename
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema);
