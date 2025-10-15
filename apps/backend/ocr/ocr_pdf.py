#!/usr/bin/env python3
"""Utility script that extracts text from PDFs or images.

This script is intentionally lightweight so the Node backend can delegate
expensive OCR work to Python tooling. The script prints a JSON payload to
stdout with a `text` field that contains the extracted text.
"""

import argparse
import json
import pathlib
import sys
from typing import Optional

try:
    from pdfminer.high_level import extract_text as pdf_extract_text
except ImportError:  # pragma: no cover
    pdf_extract_text = None

try:
    from PIL import Image
    import pytesseract
except ImportError:  # pragma: no cover
    Image = None
    pytesseract = None


def read_pdf(path: pathlib.Path) -> Optional[str]:
    if pdf_extract_text is None:
        raise RuntimeError("pdfminer.six is not installed")
    return pdf_extract_text(str(path))


def read_image(path: pathlib.Path) -> Optional[str]:
    if Image is None or pytesseract is None:
        raise RuntimeError("pytesseract and Pillow are required for image OCR")
    with Image.open(path) as image:
        return pytesseract.image_to_string(image)


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract text using OCR")
    parser.add_argument("--input", required=True, help="Path to a PDF or image")
    args = parser.parse_args()

    input_path = pathlib.Path(args.input)
    if not input_path.exists():
        print(json.dumps({"error": "Input file does not exist"}))
        return 1

    try:
        suffix = input_path.suffix.lower()
        if suffix in {".pdf"}:
            text = read_pdf(input_path)
        elif suffix in {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp"}:
            text = read_image(input_path)
        else:
            raise RuntimeError(f"Unsupported file type: {suffix}")
    except Exception as exc:  # pragma: no cover - surfaced to Node caller
        print(json.dumps({"error": str(exc)}))
        return 1

    print(json.dumps({"text": text or ""}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
