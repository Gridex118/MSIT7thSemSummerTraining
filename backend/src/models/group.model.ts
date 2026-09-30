import { Schema, model } from "mongoose";

const groupSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    avatar: { type: String, default: null },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
  },
  { timestamps: true },
);

export const Group = model("Group", groupSchema);
