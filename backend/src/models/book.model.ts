import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, trim: true },
    authorKey: { type: String },
    workKey: { type: String, required: true, index: true },
    editionKey: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const Book = model("Book", bookSchema);
