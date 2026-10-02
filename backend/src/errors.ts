import type { Response } from "express";

export function handleError(res: Response, err: unknown) {
  if (err instanceof ServiceError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if ((err as { code?: number }).code === 11000) {
    res.status(409).json({ error: "Username or email already in use" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}

export class ServiceError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
