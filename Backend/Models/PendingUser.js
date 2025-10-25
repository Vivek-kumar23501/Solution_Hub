import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  otpVerified: { type: Boolean, default: false },
});

export default mongoose.model("PendingUser", pendingUserSchema);
