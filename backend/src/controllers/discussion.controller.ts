import type { Request, Response } from "express";
import * as discussionService from "../services/discussion.service.ts";
import { ServiceError } from "../errors.ts";

const CONTENT_TYPES = ["text", "image"];

function handleError(res: Response, err: unknown) {
  if (err instanceof ServiceError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}

export async function getDiscussion(req: Request, res: Response) {
  try {
    const discussion = await discussionService.getDiscussion(
      String(req.params.id),
    );
    res.json(discussion);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getChats(req: Request, res: Response) {
  try {
    const chats = await discussionService.getChats(String(req.params.id));
    res.json(chats);
  } catch (err) {
    handleError(res, err);
  }
}

export async function createChat(req: Request, res: Response) {
  const { sender, content } = req.body;
  const contentType = String(req.body.contentType ?? "text");
  if (!sender || !content || !String(content).trim()) {
    res.status(400).json({ error: "sender and content are required" });
    return;
  }
  if (!CONTENT_TYPES.includes(contentType)) {
    res.status(400).json({ error: "contentType must be text or image" });
    return;
  }
  try {
    const chat = await discussionService.createChat(String(req.params.id), {
      sender: String(sender),
      contentType: contentType as discussionService.ChatContentType,
      content: String(content).trim(),
    });
    res.status(201).json(chat);
  } catch (err) {
    handleError(res, err);
  }
}
