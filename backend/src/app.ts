import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";

import indexRouter from "./routes/index.ts";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Express listening on port ${PORT}`);
});
