import pdfParse from "pdf-parse";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  if (!buffer || !buffer.length) {
    throw new Error("Empty PDF buffer");
  }
  const data = await pdfParse(buffer);
  return clampText(data.text ?? "");
}

export function clampText(text: string, max = 20000): string {
  return text.length > max ? text.slice(0, max) : text;
}
