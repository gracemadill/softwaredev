import { NextFunction, Request, Response } from "express";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error("API error:", err);
  if (res.headersSent) {
    return;
  }

  const status = typeof err === "object" && err !== null && "status" in err ? Number((err as any).status) : 500;
  const message =
    typeof err === "object" && err !== null && "message" in err ? String((err as any).message) : "Internal Server Error";

  res.status(Number.isNaN(status) ? 500 : status).json({ error: message });
}
