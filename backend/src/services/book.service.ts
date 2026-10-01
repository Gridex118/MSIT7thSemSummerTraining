import { Book } from "../models/book.model.ts";
import type { SimpleBookType } from "../types.ts";

export async function getBooks(): Promise<SimpleBookType[]> {
  const bookDocs = await Book.find()
    .select("_id title workKey editionKey")
    .sort({ title: 1 })
    .lean();
  const books = bookDocs.map(({ _id, ...rest }) => ({
    ...rest,
    _id: String(_id),
  }));
  return books;
}
