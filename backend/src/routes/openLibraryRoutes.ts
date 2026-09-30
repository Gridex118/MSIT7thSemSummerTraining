import express from "express";
import {
  searchBooks,
  getBookCover,
  getBookDescription,
} from "../controllers/openLibraryController.ts";

const router = express.Router();

router.get("/search", searchBooks);
router.get("/covers/:editionKey", getBookCover);
router.get("/description/:workKey", getBookDescription);

export default router;
