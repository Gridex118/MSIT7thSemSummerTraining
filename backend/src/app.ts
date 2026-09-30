import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import type { NextFunction } from "express";

import openLibraryRouter from "./routes/openLibrary.routes.ts";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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

app.listen(PORT, () => {
  console.log(`Express listening on port ${PORT}`);
});
