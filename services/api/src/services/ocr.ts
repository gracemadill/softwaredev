import Tesseract from "tesseract.js";
import { clampText } from "./pdf.js";

export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  if (!buffer || !buffer.length) {
    throw new Error("Empty image buffer");
  }

  if (process.env.ENABLE_OCR === "false" || !process.env.ENABLE_OCR) {
    return "MOCK_TEXT_FROM_OCR";
  }

  const result = await Tesseract.recognize(buffer, "eng");
  return clampText(result.data?.text ?? "");
}
