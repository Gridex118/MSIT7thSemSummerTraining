import express from "express";
import {
  createGroup,
  getPublicGroups,
  updateGroupAvatar,
  getGroupMembers,
  getGroupDiscussions,
  createDiscussion,
} from "../controllers/group.controller.ts";
import { uploadAvatar } from "../middlewares/upload.middleware.ts";

const router = express.Router();
router.post("/", createGroup);
router.get("/", getPublicGroups);
router.patch("/:id/avatar", uploadAvatar, updateGroupAvatar);
router.get("/:id/members", getGroupMembers);
router.get("/:id/discussions", getGroupDiscussions);
router.post("/:id/discussions", createDiscussion);
export default router;
