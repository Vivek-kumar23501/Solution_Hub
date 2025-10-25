import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // accepted friends
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // requests received
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // requests sent
});

export default mongoose.model("User", userSchema);
