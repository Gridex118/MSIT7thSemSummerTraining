import { Book } from "../models/book.model.ts";
import { User } from "../models/user.model.ts";
import { BookReview } from "../models/book_review.model.ts";
import type {
  SimpleBookType,
  BookReviewInputType,
  BookReviewType,
} from "../types.ts";
import { isValidObjectId, Types } from "mongoose";
import { ServiceError } from "../errors.ts";

const WORK_KEY_PATTERN = /^OL\d+W$/;
function assertValidWorkKey(workKey: string) {
  if (!WORK_KEY_PATTERN.test(workKey))
    throw new ServiceError(400, "Invalid work key");
}

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

export async function getBookReviews(
  workKey: string,
): Promise<BookReviewType[]> {
  assertValidWorkKey(workKey);
  const reviews = await BookReview.find({ bookWorkKey: workKey })
    .sort({ createdAt: -1 })
    .populate<{ user: { _id: Types.ObjectId; username: string } }>(
      "user",
      "username",
    )
    .lean();
  return reviews.map((review) => ({
    user: { _id: String(review.user._id), username: review.user.username },
    reviewText: review.reviewText,
  }));
}

export async function addBookReview(
  input: BookReviewInputType,
): Promise<BookReviewType> {
  assertValidWorkKey(input.workKey);
  if (!isValidObjectId(input.userId))
    throw new ServiceError(400, "Invalid user id");
  const user = await User.findById(input.userId).select("username").lean();
  if (!user) throw new ServiceError(404, "User not found");
  const existing = await BookReview.exists({
    bookWorkKey: input.workKey,
    user: user._id,
  });
  if (existing)
    throw new ServiceError(409, "You have already reviewed this book");
  await BookReview.create({
    bookWorkKey: input.workKey,
    user: user._id,
    reviewText: input.reviewText,
  });
  return {
    user: { _id: String(user._id), username: user.username },
    reviewText: input.reviewText,
  };
}
