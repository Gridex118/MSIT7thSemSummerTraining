import type { Request, Response } from "express";
import * as userService from "../services/user.service.ts";
import { handleError } from "../errors.ts";

export async function registerUser(req: Request, res: Response) {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    res
      .status(400)
      .json({ error: "name, username, email and password are required" });
    return;
  }
  try {
    const user = await userService.registerUser({
      name,
      username,
      email,
      password,
    });
    res.status(201).json(user);
  } catch (err) {
    handleError(res, err);
  }
}

export async function updateUser(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email && !password) {
    res.status(400).json({ error: "email or password is required" });
    return;
  }
  try {
    const user = await userService.updateUser(String(req.params.id), {
      email,
      password,
    });
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
}

export async function addBooks(req: Request, res: Response) {
  const { books } = req.body;
  const valid =
    Array.isArray(books) &&
    books.length > 0 &&
    books.every((b) => b?.title && b?.workKey && b?.editionKey);
  if (!valid) {
    res.status(400).json({
      error:
        "books must be a non-empty array of { title, workKey, editionKey }",
    });
    return;
  }
  try {
    const user = await userService.addBooks(String(req.params.id), books);
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
}

export async function joinGroup(req: Request, res: Response) {
  const groupId = String(req.body.groupId);
  try {
    await userService.joinGroup(String(req.params.id), groupId);
    res.json({ joined: true, groupId });
  } catch (err) {
    handleError(res, err);
  }
}

export async function updateAvatar(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ error: "Avatar image file is required" });
    return;
  }
  try {
    const user = await userService.updateAvatar(
      String(req.params.id),
      req.file.filename,
    );
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    const profile = await userService.getUserProfile(String(req.params.id));
    res.json(profile);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getAllUsers(_req: Request, res: Response) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    handleError(res, err);
  }
}
