import { Router } from "express";
import { z } from "zod";
import { rewriteText } from "../services/openai.js";

const router = Router();

const rewriteSchema = z.object({
  text: z.string().min(1).max(5000),
  rules: z
    .object({
      keepTerms: z.array(z.string()).optional(),
      temperature: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

router.post("/rewrite", async (req, res, next) => {
  try {
    const { text, rules } = rewriteSchema.parse(req.body);
    const easyReadText = await rewriteText(text, rules);
    res.json({ easyReadText });
  } catch (err) {
    next(err);
  }
});

export { router as aiRouter };
