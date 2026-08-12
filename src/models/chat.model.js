import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    title: { type: String, default: "New Chat", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Chat", chatSchema);
