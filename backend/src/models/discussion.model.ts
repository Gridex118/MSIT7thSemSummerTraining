import { Schema, model } from "mongoose";
const discussionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    startedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);
export const Discussion = model("Discussion", discussionSchema);
