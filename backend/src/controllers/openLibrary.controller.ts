import type { Response, Request } from "express";
import * as openLibraryService from "../services/openLibrary.service.ts";

import type { CoverSizeType } from "../types.ts";

const WORK_KEY_PATTERN = /^OL\d+W$/;
const EDITION_KEY_PATTERN = /^OL\d+M$/;

function isCoverSize(value: string): value is CoverSizeType {
  return ["S", "M", "L"].includes(value);
}

export async function searchBooks(req: Request, res: Response) {
  const query = String(req.query.q ?? "").trim();
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const page = Number(req.query.page) || 1;
  if (!query) {
    res.status(400).json({ error: "Query parameter 'q' is required" });
    return;
  }
  try {
    const books = await openLibraryService.fetchOpenLibrarySearch(
      query,
      limit,
      page,
    );
    res.status(200).json(books ?? []);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to fetch from Open Library" });
  }
}

export async function getBookDescription(
  req: Request<{ workKey: string }>,
  res: Response,
) {
  const { workKey } = req.params;
  if (!WORK_KEY_PATTERN.test(workKey)) {
    res.status(400).json({ error: "Invalid work key" });
    return;
  }
  try {
    const description =
      await openLibraryService.fetchOpenLibraryDescription(workKey);
    res.status(200).json({ description });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to fetch from Open Library" });
  }
}

export async function getWorkAttributes(
  req: Request<{ workKey: string }>,
  res: Response,
) {
  const { workKey } = req.params;
  if (!WORK_KEY_PATTERN.test(workKey)) {
    res.status(400).json({ error: "Invalid work key" });
    return;
  }
  try {
    const attributes =
      await openLibraryService.fetchOpenLibraryWorkAttributes(workKey);
    res.status(200).json(attributes);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to fetch from Open Library" });
  }
}

export async function getEditionAttributes(
  req: Request<{ editionKey: string }>,
  res: Response,
) {
  const { editionKey } = req.params;
  if (!EDITION_KEY_PATTERN.test(editionKey)) {
    res.status(400).json({ error: "Invalid work key" });
    return;
  }
  try {
    const attributes =
      await openLibraryService.fetchOpenLibraryEditionAttributes(editionKey);
    res.status(200).json(attributes);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Failed to fetch from Open Library" });
  }
}

export function getBookCover(
  req: Request<{ editionKey: string }>,
  res: Response,
) {
  const { editionKey } = req.params;
  const size = String(req.query.size ?? "M").toUpperCase();
  if (!EDITION_KEY_PATTERN.test(editionKey)) {
    res.status(400).json({ error: "Invalid edition key" });
    return;
  }
  if (!isCoverSize(size)) {
    res.status(400).json({ error: "Size must be S, M or L" });
    return;
  }
  res.redirect(openLibraryService.getOpenLibraryBookCoverURL(editionKey, size));
}
