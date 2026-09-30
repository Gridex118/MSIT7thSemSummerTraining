import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
  updateUser,
  addBooks,
  getBooksInList,
  joinGroup,
  updateAvatar,
} from "../controllers/user.controller.ts";
import { uploadAvatar } from "../middlewares/upload.middleware.ts";
import { requireAuth, requireSelf } from "../middlewares/auth.middleware.ts";

const router = express.Router();
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/:id", getUserProfile);
router.get("/:id/books", getBooksInList);
router.patch("/:id", requireAuth, requireSelf, updateUser);
router.post("/:id/books", requireAuth, requireSelf, addBooks);
router.post("/:id/groups", requireAuth, requireSelf, joinGroup);
router.patch(
  "/:id/avatar",
  requireAuth,
  requireSelf,
  uploadAvatar,
  updateAvatar,
);
export default router;
