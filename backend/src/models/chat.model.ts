import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  discussion: {
    type: Schema.Types.ObjectId,
    ref: "Discussion",
    required: true,
  },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sentAt: { type: Date, default: Date.now },
  contentType: { type: String, enum: ["text", "image"], default: "text" },
  content: { type: String, required: true },
});
chatSchema.index({ discussion: 1, sentAt: 1 });

export const Chat = model("Chat", chatSchema);
