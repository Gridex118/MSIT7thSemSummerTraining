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

export async function getBookReviews(req: Request, res: Response) {
  try {
    const reviews = await bookService.getBookReviews(
      String(req.params.workKey),
    );
    res.json(reviews);
  } catch (err) {
    handleError(res, err);
  }
}

export async function addBookReview(req: Request, res: Response) {
  const reviewText = String(req.body.reviewText ?? "").trim();
  if (!reviewText) {
    res.status(400).json({ error: "reviewText is required" });
    return;
  }
  try {
    const review = await bookService.addBookReview({
      userId: req.userId as string,
      workKey: String(req.params.workKey),
      reviewText,
    });
    res.status(201).json(review);
  } catch (err) {
    handleError(res, err);
  }
}
