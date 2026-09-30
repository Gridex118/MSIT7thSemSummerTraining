import express from "express";
import {
  registerUser,
  getAllUsers,
  getUserProfile,
  updateUser,
  addBooks,
  getBooksInList,
  joinGroup,
  updateAvatar,
} from "../controllers/user.controller.ts";
import { uploadAvatar } from "../middlewares/upload.middleware.ts";

const router = express.Router();
router.post("/", registerUser);
router.get("/", getAllUsers);
router.get("/:id", getUserProfile);
router.get("/:id/books", getBooksInList);
router.patch("/:id", updateUser);
router.post("/:id/books", addBooks);
router.post("/:id/groups", joinGroup);
router.patch("/:id/avatar", uploadAvatar, updateAvatar);
export default router;
