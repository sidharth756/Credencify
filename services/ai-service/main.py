import re
import os
import cv2
import spacy
import fitz  # PyMuPDF
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Credencify AI OCR Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global OCR engines
easy_ocr_reader = None

# Initialize EasyOCR
try:
    import easyocr
    easy_ocr_reader = easyocr.Reader(['en'])
    print("[AI ENGINE] Successfully loaded EasyOCR reader.")
except Exception as ex:
    print(f"[AI ENGINE] Critical Error: Failed to load EasyOCR reader. Detail: {ex}")

# Initialize SpaCy NER engine
try:
    nlp = spacy.load("en_core_web_sm")
except Exception as e:
    print(f"[AI ENGINE] SpaCy model not found, attempting to download: {e}")
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

@app.post("/api/v1.0/ai/ocr-extract")
async def extract_ocr_entities(file: UploadFile = File(...)):
    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".png", ".jpg", ".jpeg", ".pdf"]:
        raise HTTPException(status_code=400, detail="Only PNG, JPG, JPEG, or PDF files are supported for OCR extraction.")

    try:
        # Read bytes and save to a temporary file
        content = await file.read()
        temp_filename = f"temp_{file.filename}"
        with open(temp_filename, "wb") as f:
            f.write(content)

        # If PDF: convert each page to an image using PyMuPDF
        image_paths = []
        if ext == ".pdf":
            pdf_doc = fitz.open(temp_filename)
            for page_num in range(len(pdf_doc)):
                page = pdf_doc[page_num]
                mat = fitz.Matrix(2, 2)  # 2x zoom for better OCR resolution
                pix = page.get_pixmap(matrix=mat)
                img_path = f"temp_page_{page_num}_{file.filename}.png"
                pix.save(img_path)
                image_paths.append(img_path)
            pdf_doc.close()
            print(f"[AI ENGINE] PDF converted to {len(image_paths)} image(s) for processing.")
        else:
            image_paths = [temp_filename]

        # 1. Scan images for QR codes using OpenCV's QRCodeDetector
        qr_id = None
        try:
            for img_path in image_paths:
                img = cv2.imread(img_path)
                if img is not None:
                    detector = cv2.QRCodeDetector()
                    val, points, straight_qrcode = detector.detectAndDecode(img)
                    if val:
                        # Look for ?id=CERT-9099 or similar query parameters
                        match = re.search(r'[?&]id=([^&]+)', val)
                        if match:
                            qr_id = match.group(1).upper()
                            print(f"[AI ENGINE] Successfully decoded QR code Certificate ID: {qr_id}")
                            break  # Stop after first QR found
        except Exception as qre:
            print(f"[AI ENGINE] QR Code detection skipped/failed: {qre}")

        # 2. Run OCR using EasyOCR on all pages
        extracted_lines = []
        if easy_ocr_reader:
            for img_path in image_paths:
                ocr_result = easy_ocr_reader.readtext(img_path)
                if ocr_result:
                    for line in ocr_result:
                        text = line[1].strip()
                        if text:
                            extracted_lines.append(text)
        else:
            raise Exception("No active OCR engine loaded in Python service.")

        # Cleanup all temp files
        for img_path in image_paths:
            if os.path.exists(img_path):
                os.remove(img_path)
        if ext == ".pdf" and os.path.exists(temp_filename):
            os.remove(temp_filename)

        full_text = " ".join(extracted_lines)

        # 3. Extract Certificate ID via Regex pattern (as a fallback)
        certificate_id = None
        id_match = re.search(r'(CERT-\d+|CRT\d+)', full_text, re.IGNORECASE)
        if id_match:
            certificate_id = id_match.group(1).upper()
        else:
            # Fallback search inside individual lines
            for line in extracted_lines:
                line_match = re.search(r'(CERT-\d+|CRT\d+)', line, re.IGNORECASE)
                if line_match:
                    certificate_id = line_match.group(1).upper()
                    break

        # 4. SpaCy NER NLP Parsing
        doc = nlp(full_text)

        # Extract PERSON entities for recipient name
        persons = [ent.text.strip() for ent in doc.ents if ent.label_ == "PERSON"]
        learner_name = None
        # Heuristic filters to skip common noise words
        noise_words = ["certified", "ledger", "registry", "authority", "verification", "academy", "university", "republic", "blockchain"]
        clean_persons = [
            p for p in persons 
            if len(p.split()) >= 2 and not any(w in p.lower() for w in noise_words)
        ]
        
        if clean_persons:
            learner_name = clean_persons[0]
        else:
            # Heuristic fallback: check lines following introductory cert phrases
            for i, line in enumerate(extracted_lines):
                low_line = line.lower()
                if "certifies that" in low_line or "awarded to" in low_line or "presented to" in low_line:
                    if i + 1 < len(extracted_lines):
                        learner_name = extracted_lines[i + 1].strip()
                        break

        # Extract ORG entities for issuing institution
        orgs = [ent.text.strip() for ent in doc.ents if ent.label_ == "ORG"]
        institution_name = None
        inst_keywords = ["university", "academy", "college", "institute", "school", "center", "global", "tech"]
        clean_orgs = [o for o in orgs if any(k in o.lower() for k in inst_keywords)]
        
        if clean_orgs:
            institution_name = clean_orgs[0]
        else:
            # Heuristic fallback: check lines containing keywords
            for line in extracted_lines:
                if any(k in line.lower() for k in inst_keywords):
                    institution_name = line.strip()
                    break

        # Extract Course / Program Title
        course_name = None
        course_keywords = ["completion of", "development", "engineering", "science", "programming", "course", "degree", "diploma", "technology", "analytics"]
        for line in extracted_lines:
            if learner_name and learner_name.lower() in line.lower():
                continue
            if institution_name and institution_name.lower() in line.lower():
                continue
            if any(k in line.lower() for k in course_keywords) and len(line.split()) >= 2:
                course_name = line.strip()
                # Clean up prefixes
                clean_match = re.search(r'(?:completion of|course in|program in|for)\s+(.+)', course_name, re.IGNORECASE)
                if clean_match:
                    course_name = clean_match.group(1).strip()
                break

        return {
            "certificateId": certificate_id,
            "qrCertificateId": qr_id,
            "learnerName": learner_name,
            "courseName": course_name,
            "institutionName": institution_name,
            "rawText": full_text
        }

    except Exception as e:
        # Cleanup temp file on error if it still exists
        if 'temp_filename' in locals() and os.path.exists(temp_filename):
            os.remove(temp_filename)
        raise HTTPException(status_code=500, detail=f"OCR parsing error: {str(e)}")
