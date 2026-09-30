import { Schema, model } from "mongoose";

const userBookSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    readStatus: {
      type: String,
      enum: ["planning", "reading", "read"],
      default: "reading",
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true },
);
userBookSchema.index({ user: 1, book: 1 }, { unique: true });

export const UserBook = model("UserBook", userBookSchema);
