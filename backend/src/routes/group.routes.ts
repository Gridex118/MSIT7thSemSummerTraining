import express from "express";
import {
  createGroup,
  getPublicGroups,
  updateGroupAvatar,
  getGroupDetails,
  createDiscussion,
} from "../controllers/group.controller.ts";
import { uploadAvatar } from "../middlewares/upload.middleware.ts";
import { requireAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();
router.post("/", requireAuth, createGroup);
router.get("/", getPublicGroups);
router.patch("/:id/avatar", requireAuth, uploadAvatar, updateGroupAvatar);
router.get("/:id", getGroupDetails);
router.post("/:id/discussions", requireAuth, createDiscussion);
export default router;
