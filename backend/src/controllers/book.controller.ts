import * as bookService from "../services/book.service.ts";
import type { Request, Response } from "express";
import { handleError } from "../errors.ts";

export async function getBooks(_req: Request, res: Response) {
  try {
    const books = await bookService.getBooks();
    res.json(books);
  } catch (err) {
    handleError(res, err);
  }
}
