import express from "express";
import {
  getDiscussion,
  getChats,
  createChat,
} from "../controllers/discussion.controller.ts";

const router = express.Router();
router.get("/:id", getDiscussion);
router.get("/:id/chats", getChats);
router.post("/:id/chats", createChat);
export default router;
