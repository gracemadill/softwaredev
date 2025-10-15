import { Router } from "express";
import multer from "multer";
import { extractTextFromPdf, clampText } from "../services/pdf.js";
import { extractTextFromImage } from "../services/ocr.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/pdf", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const text = await extractTextFromPdf(req.file.buffer);
    res.json({ text });
  } catch (err) {
    next(err);
  }
});

router.post("/image", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const text = await extractTextFromImage(req.file.buffer);
    res.json({ text });
  } catch (err) {
    next(err);
  }
});

router.post("/url", async (req, res, next) => {
  try {
    const url = req.body?.url as string | undefined;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL (${response.status})`);
    }
    const html = await response.text();
    const text = clampText(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    res.json({ text });
  } catch (err) {
    next(err);
  }
});

export { router as uploadRouter };
