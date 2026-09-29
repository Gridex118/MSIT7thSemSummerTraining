import express, { type Request, type Response } from "express";

const indexRouter = express.Router();
indexRouter.get("/", (_req: Request, res: Response) => {
  res.send("Hello from Express");
});

export default indexRouter;
