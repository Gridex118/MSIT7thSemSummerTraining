import type { Request, Response } from "express";
import * as groupService from "../services/group.service.ts";
import { handleError } from "../errors.ts";

export async function createGroup(req: Request, res: Response) {
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(400).json({ error: "name and description are required" });
    return;
  }
  try {
    const group = await groupService.createGroup({
      name: String(name),
      description: String(description),
      owner: req.userId!,
    });
    res.status(201).json(group);
  } catch (err) {
    handleError(res, err);
  }
}

export async function updateGroupAvatar(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ error: "Avatar image file is required" });
    return;
  }
  try {
    const group = await groupService.updateGroupAvatar(
      String(req.params.id),
      req.userId as string,
      req.file.filename,
    );
    res.json(group);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getPublicGroups(_req: Request, res: Response) {
  try {
    const groups = await groupService.getPublicGroups();
    res.json(groups);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getGroupMembers(req: Request, res: Response) {
  try {
    const members = await groupService.getGroupMembers(String(req.params.id));
    res.json(members);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getGroupDiscussions(req: Request, res: Response) {
  try {
    const discussions = await groupService.getGroupDiscussions(
      String(req.params.id),
    );
    res.status(200).json(discussions);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getGroupDetails(req: Request, res: Response) {
  try {
    const group = await groupService.getGroupDetails(String(req.params.id));
    res.json(group);
  } catch (err) {
    handleError(res, err);
  }
}

export async function createDiscussion(req: Request, res: Response) {
  const { title, book } = req.body;
  const validBook = book?.title && book?.workKey && book?.editionKey;
  if (!title || !String(title).trim() || !validBook) {
    res.status(400).json({
      error: "title and book { title, workKey, editionKey } are required",
    });
    return;
  }
  try {
    const discussion = await groupService.createDiscussion(
      String(req.params.id),
      {
        title: String(title).trim(),
        startedBy: req.userId as string,
        book: {
          title: String(book.title),
          workKey: String(book.workKey),
          editionKey: String(book.editionKey),
        },
      },
    );
    res.status(201).json(discussion);
  } catch (err) {
    handleError(res, err);
  }
}
