import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.ts";
import {
  getBooks,
  getBookReviews,
  addBookReview,
} from "../controllers/book.controller.ts";

const router = Router();

router.get("/", getBooks);
router.get("/:workKey", getBookReviews);
router.post("/:workKey", requireAuth, addBookReview);

export default router;
