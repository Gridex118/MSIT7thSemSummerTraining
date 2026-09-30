import express from "express";
import {
  getDiscussion,
  getChats,
  createChat,
} from "../controllers/discussion.controller.ts";
import { requireAuth } from "../middlewares/auth.middleware.ts";

const router = express.Router();
router.get("/:id", getDiscussion);
router.get("/:id/chats", getChats);
router.post("/:id/chats", requireAuth, createChat);
export default router;
