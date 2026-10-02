import express from "express";
import {
  searchBooks,
  getBookCover,
  getBookDescription,
  getWorkAttributes,
  getEditionAttributes,
} from "../controllers/openLibrary.controller.ts";

const router = express.Router();

router.get("/search", searchBooks);
router.get("/covers/:editionKey", getBookCover);
router.get("/description/:workKey", getBookDescription);
router.get("/work/:workKey", getWorkAttributes);
router.get("/edition/:editionKey", getEditionAttributes);

export default router;
