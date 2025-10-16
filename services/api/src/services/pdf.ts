
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  if (!buffer || !buffer.length) {
    throw new Error("Empty PDF buffer");
  }

  const { default: pdfParse } = await import("pdf-parse");

  try {
    const data = await pdfParse(buffer);
    return clampText(data.text ?? "");
  } catch (err) {
    console.error("PDF parsing failed:", err);
    throw new Error("PDF parsing failed");
  }
}

export function clampText(text: string, max = 20000): string {
  return text.length > max ? text.slice(0, max) : text;
}