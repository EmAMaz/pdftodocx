import sys
import os
from pdf2docx import Converter

def convert_pdf_to_docx(pdf_path):
    try:
        # Verificar si el archivo PDF existe
        if not os.path.isfile(pdf_path):
            print(f"Error: El archivo {pdf_path} no existe.")
            sys.exit(1)

        # Verificar si el archivo tiene la extensión .pdf
        if not pdf_path.lower().endswith(".pdf"):
            print(f"Error: El archivo {pdf_path} no es un archivo PDF.")
            sys.exit(1)

        # Crear el nombre del archivo DOCX basado en el nombre del archivo PDF
        docx_filename = os.path.basename(pdf_path).replace(".pdf", ".docx")
        docx_path = os.path.join("docx", docx_filename)

        # Convertir el archivo PDF a DOCX
        cv = Converter(pdf_path)
        cv.convert(docx_path, start=0, end=None)
        cv.close()

        print(f"Conversion successful: {docx_path}")
    except Exception as e:
        print(f"Error during conversion: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python convert_pdf_to_docx.py <path_to_pdf>")
        sys.exit(1)

    pdf_path = sys.argv[1]
    convert_pdf_to_docx(pdf_path)
