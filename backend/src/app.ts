import "dotenv/config";

import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import type { NextFunction } from "express";
import { connectToMongoDB, disconnectFromMongoDB } from "./atlas.ts";

import openLibraryRouter from "./routes/openLibrary.routes.ts";
import userRouter from "./routes/user.routes.ts";
import groupRouter from "./routes/group.routes.ts";
import discussionRouter from "./routes/discussion.routes.ts";
import bookRouter from "./routes/book.routes.ts";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let dbReady: Promise<unknown> | undefined;
function ensureDb() {
  dbReady ??= connectToMongoDB().catch((err) => {
    dbReady = undefined; // allow a retry on the next request
    throw err;
  });
  return dbReady;
}
app.use(async (_req, _res, next) => {
  await ensureDb();
  next();
});

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (
    err instanceof multer.MulterError ||
    err.message.startsWith("Only JPEG")
  ) {
    res.status(400).json({ error: err.message });
    return;
  }
  next(err);
});

app.get("/", (_req: Request, res: Response) => {
  res.send(
    "__BOOKS_GROUP/0.1 (alpha)<br/>" +
      "All Rights Reserved<br/>" +
      "&copy; 2026 ROSEGRIDALEX",
  );
});
app.use("/uploads", express.static("uploads"));
app.use("/v1/openLibrary", openLibraryRouter);
app.use("/v1/users", userRouter);
app.use("/v1/groups", groupRouter);
app.use("/v1/discussions", discussionRouter);
app.use("/v1/books", bookRouter);

export default app;

if (!process.env.VERCEL) {
  async function serve() {
    await ensureDb();
    app.listen(PORT, () => console.log(`Express listening on port ${PORT}`));
  }
  serve().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });

  for (const sig of ["SIGINT", "SIGTERM"]) {
    process.on(sig, async () => {
      await disconnectFromMongoDB();
      process.exit(0);
    });
  }
}
