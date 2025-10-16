import { Router } from "express";
import { z } from "zod";
import { getUsage, incrementUsage } from "../services/usage.js";

const router = Router();

function resolveUserId(req: any): string {
  return (req.header("x-user-id") || req.body?.userId || req.query?.userId || "demo-user") as string;
}

router.get("/me", (req, res) => {
  const summary = getUsage(resolveUserId(req));
  res.json(summary);
});

router.post("/increment", (req, res) => {
  const bodySchema = z.object({ userId: z.string().optional() });
  const { userId } = bodySchema.parse(req.body ?? {});
  const summary = incrementUsage(userId || resolveUserId(req));
  res.json(summary);
});

export { router as usageRouter };
