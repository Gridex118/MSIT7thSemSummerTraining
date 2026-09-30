import type { Request, Response } from "express";
import * as discussionService from "../services/discussion.service.ts";
import { ServiceError, handleError } from "../errors.ts";

const CONTENT_TYPES = ["text", "image"];

export async function getDiscussion(req: Request, res: Response) {
  try {
    const discussion = await discussionService.getDiscussion(
      String(req.params.id),
    );
    res.status(200).json(discussion);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getChats(req: Request, res: Response) {
  try {
    const chats = await discussionService.getChats(String(req.params.id));
    res.status(200).json(chats);
  } catch (err) {
    handleError(res, err);
  }
}

export async function createChat(req: Request, res: Response) {
  const { content } = req.body;
  const contentType = String(req.body.contentType ?? "text");
  if (!content || !String(content).trim()) {
    res.status(400).json({ error: "content is required" });
    return;
  }
  if (!CONTENT_TYPES.includes(contentType)) {
    res.status(400).json({ error: "contentType must be text or image" });
    return;
  }
  try {
    const chat = await discussionService.createChat(String(req.params.id), {
      sender: req.userId!,
      contentType: contentType as discussionService.ChatContentType,
      content: String(content).trim(),
    });
    res.status(201).json(chat);
  } catch (err) {
    handleError(res, err);
  }
}
