#!/usr/bin/env python3
"""
Extract text from PDF files for canone concordato analysis
v1.0.0 - 2026-01-30
"""

import sys
import os
from PyPDF2 import PdfReader

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract all text from a PDF file."""
    try:
        reader = PdfReader(pdf_path)
        text_parts = []
        for page_num, page in enumerate(reader.pages, 1):
            page_text = page.extract_text()
            if page_text:
                text_parts.append(f"--- PAGINA {page_num} ---\n{page_text}")
        return "\n\n".join(text_parts)
    except Exception as e:
        return f"ERROR: {e}"

def main():
    if len(sys.argv) < 2:
        print("Usage: python extract_pdf_text.py <pdf_path>")
        sys.exit(1)

    pdf_path = sys.argv[1]
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        sys.exit(1)

    text = extract_text_from_pdf(pdf_path)
    print(text)

if __name__ == "__main__":
    main()
