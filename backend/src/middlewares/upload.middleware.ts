import "dotenv/config";

import type { Request } from "express";
import multer from "multer";
import path from "node:path";
import fs from "fs";

const AVATAR_DIR = process.env.VERCEL
  ? "/tmp/uploads/avatars"
  : path.join("uploads", "avatars");
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

fs.mkdirSync(AVATAR_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
  filename: (_req, file, cb) =>
    cb(null, `${crypto.randomUUID()}${EXTENSIONS[file.mimetype]}`),
});

function avatarFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (file.mimetype in EXTENSIONS) {
    cb(null, true);
    return;
  }
  cb(new Error("Only JPEG, PNG or WebP images are allowed"));
}

export const uploadAvatar = multer({
  storage,
  fileFilter: avatarFilter,
  limits: { fileSize: MAX_AVATAR_BYTES },
}).single("avatar");
