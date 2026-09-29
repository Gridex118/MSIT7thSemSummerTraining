import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";

import openLibraryRouter from "./routes/openLibraryRoutes.ts";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.send(
    "__BOOKS_GROUP/0.1 (alpha)<br/>" +
      "All Rights Reserved<br/>" +
      "&copy; 2026 ROSEGRIDALEX",
  );
});
app.use("/v1/openLibrary", openLibraryRouter);

app.listen(PORT, () => {
  console.log(`Express listening on port ${PORT}`);
});
