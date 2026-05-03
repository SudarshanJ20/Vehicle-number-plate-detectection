"""
PlateAI FastAPI Server
Wraps the existing ANPRDetector from ../backend/detector.py
Endpoint matches frontend: POST /api/detect
"""

import sys
import os
import base64
import time

# Point to backend/ so we can import ANPRDetector
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import numpy as np
import cv2

from detector import ANPRDetector
from preprocess import detect_brightness

load_dotenv()

# ── Init ──────────────────────────────────────────────────────────────────────
MODEL_PATH = os.getenv("MODEL_PATH", "../backend/best.pt")
detector = ANPRDetector(model_path=MODEL_PATH)

app = FastAPI(
    title="PlateAI ML API",
    description="YOLOv8 ANPR detection — wraps ANPRDetector",
    version="1.0.0"
)

# ── CORS ──────────────────────────────────────────────────────────────────────
ALLOWED_ORIGINS = [
    os.getenv("ALLOWED_ORIGIN", "http://localhost:5173"),
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Helpers ───────────────────────────────────────────────────────────────────
def bytes_to_rgb(image_bytes: bytes):
    """Convert raw image bytes → RGB numpy array"""
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img_bgr = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img_bgr is None:
        raise ValueError("Could not decode image")
    return cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)


def rgb_to_base64(img_rgb: np.ndarray) -> str:
    """Convert RGB numpy array → base64 JPEG string"""
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    _, buffer = cv2.imencode('.jpg', img_bgr, [cv2.IMWRITE_JPEG_QUALITY, 90])
    return "data:image/jpeg;base64," + base64.b64encode(buffer).decode('utf-8')


def build_response(result: dict, process_time_ms: int) -> dict:
    """Shape ANPRDetector output into clean API response"""
    annotated_b64 = rgb_to_base64(result["annotated_image"])

    return {
        "success": True,
        "plate_text": result.get("plate_text", ""),
        "confidence": round(result.get("detection_confidence", 0) * 100, 1),
        "ocr_confidence": round(result.get("ocr_confidence", 0) * 100, 1),
        "state": result.get("state", "Unknown"),
        "plate_type": result.get("plate_type", "Unknown"),
        "preprocessing_applied": result.get("preprocessing_applied", []),
        "bounding_box": result.get("bounding_box", {}),
        "annotated_image": annotated_b64,
        "process_time_ms": process_time_ms,
    }


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "PlateAI ML API running ✅", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": True}


@app.post("/api/detect")
async def detect(file: UploadFile = File(...)):
    """
    Main endpoint — matches frontend utils/api.js exactly.
    Accepts image upload → returns plate detection JSON.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (jpg/png/webp/bmp)")

    image_bytes = await file.read()

    if len(image_bytes) > 15 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image too large. Max 15MB.")

    try:
        img_rgb = bytes_to_rgb(image_bytes)
    except ValueError:
        raise HTTPException(status_code=422, detail="Could not decode image. Make sure it's a valid image file.")

    # Brightness info (logged server-side)
    brightness = detect_brightness(img_rgb)
    print(f"[API] Brightness: {brightness:.1f}/255")

    start = time.time()
    try:
        result = detector.detect_and_recognize(img_rgb)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

    process_time = round((time.time() - start) * 1000)

    if not result.get("plate_text"):
        raise HTTPException(status_code=422, detail="No number plate detected in this image.")

    return JSONResponse(content=build_response(result, process_time))


# ── Base64 endpoint (bonus — for mobile/direct use) ───────────────────────────
class Base64Request(BaseModel):
    image: str

@app.post("/api/detect-base64")
async def detect_base64(body: Base64Request):
    """Accept base64 encoded image string"""
    try:
        b64 = body.image
        if "," in b64:
            b64 = b64.split(",")[1]
        image_bytes = base64.b64decode(b64)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 image string")

    try:
        img_rgb = bytes_to_rgb(image_bytes)
    except ValueError:
        raise HTTPException(status_code=422, detail="Could not decode image")

    start = time.time()
    try:
        result = detector.detect_and_recognize(img_rgb)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

    process_time = round((time.time() - start) * 1000)

    if not result.get("plate_text"):
        raise HTTPException(status_code=422, detail="No number plate detected in this image.")

    return JSONResponse(content=build_response(result, process_time))