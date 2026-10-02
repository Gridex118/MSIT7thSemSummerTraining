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

export async function loginUser(req: Request, res: Response) {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    res.status(400).json({ error: "identifier and password are required" });
    return;
  }
  try {
    const result = await userService.loginUser({
      identifier: String(identifier),
      password: String(password),
    });
    res.status(200).json(result);
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
    const user = await userService.addBooks(
      String(req.params.id),
      books,
      req.body.readStatus,
      Number(req.body.rating) || undefined,
    );
    res.status(200).json(user);
  } catch (err) {
    handleError(res, err);
  }
}

export async function getBooksInList(req: Request, res: Response) {
  try {
    const books = await userService.getBooksInList(String(req.params.id));
    res.status(200).json(books);
  } catch (err) {
    handleError(res, err);
  }
}

export async function joinGroup(req: Request, res: Response) {
  const groupId = String(req.params.groupId);
  try {
    await userService.joinGroup({ userId: String(req.params.id), groupId });
    res.json({ joined: true, groupId });
  } catch (err) {
    handleError(res, err);
  }
}

export async function leaveGroup(req: Request, res: Response) {
  const groupId = String(req.params.groupId);
  try {
    await userService.leaveGroup({ userId: String(req.params.id), groupId });
    res.json({ left: true, groupId });
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
    res.status(200).json(users);
  } catch (err) {
    handleError(res, err);
  }
}
