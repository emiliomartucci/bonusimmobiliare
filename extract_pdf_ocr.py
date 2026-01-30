#!/usr/bin/env python3
"""
Extract text from scanned PDF files using OCR (tesseract)
v1.0.0 - 2026-01-30
"""

import sys
import os

try:
    from pdf2image import convert_from_path
    import pytesseract
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Install with: pip3 install pdf2image pytesseract")
    sys.exit(1)

def extract_text_with_ocr(pdf_path: str, max_pages: int = None) -> str:
    """Extract text from a scanned PDF using OCR."""
    try:
        # Convert PDF to images
        print(f"Converting PDF to images...", file=sys.stderr)
        images = convert_from_path(pdf_path, dpi=200)

        if max_pages:
            images = images[:max_pages]

        text_parts = []
        total_pages = len(images)

        for page_num, image in enumerate(images, 1):
            print(f"OCR page {page_num}/{total_pages}...", file=sys.stderr)
            # Run OCR with Italian language
            page_text = pytesseract.image_to_string(image, lang='ita')
            if page_text.strip():
                text_parts.append(f"--- PAGINA {page_num} ---\n{page_text}")

        return "\n\n".join(text_parts)
    except Exception as e:
        return f"ERROR: {e}"

def main():
    if len(sys.argv) < 2:
        print("Usage: python extract_pdf_ocr.py <pdf_path> [max_pages]")
        sys.exit(1)

    pdf_path = sys.argv[1]
    max_pages = int(sys.argv[2]) if len(sys.argv) > 2 else None

    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        sys.exit(1)

    text = extract_text_with_ocr(pdf_path, max_pages)
    print(text)

if __name__ == "__main__":
    main()
