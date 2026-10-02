import { Schema, model } from "mongoose";

const bookReviewSchema = new Schema(
  {
    bookWorkKey: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewText: { type: String, required: true },
  },
  { timestamps: true },
);
bookReviewSchema.index({ bookWorkKey: 1, user: 1 }, { unique: true });

export const BookReview = model("BookReview", bookReviewSchema);
