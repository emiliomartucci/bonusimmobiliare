#!/usr/bin/env python3
"""
Extract text from PDF files using pdfplumber (better for complex PDFs)
v1.0.0 - 2026-01-30
"""

import sys
import os
import pdfplumber

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract all text from a PDF file using pdfplumber."""
    try:
        text_parts = []
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(f"--- PAGINA {page_num} ---\n{page_text}")

                # Extract tables if present
                tables = page.extract_tables()
                for table_idx, table in enumerate(tables, 1):
                    if table:
                        text_parts.append(f"\n--- TABELLA {table_idx} (Pagina {page_num}) ---")
                        for row in table:
                            if row:
                                row_text = " | ".join([str(cell) if cell else "" for cell in row])
                                text_parts.append(row_text)

        return "\n".join(text_parts)
    except Exception as e:
        return f"ERROR: {e}"

def main():
    if len(sys.argv) < 2:
        print("Usage: python extract_pdf_text_v2.py <pdf_path>")
        sys.exit(1)

    pdf_path = sys.argv[1]
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        sys.exit(1)

    text = extract_text_from_pdf(pdf_path)
    print(text)

if __name__ == "__main__":
    main()
