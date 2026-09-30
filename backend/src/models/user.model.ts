import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: { type: String, default: null },
    password: { type: String, required: true, select: false },
    books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  },
  { timestamps: true },
);

export const User = model("User", userSchema);
