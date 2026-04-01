from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import uuid
from datetime import datetime
from detector import ANPRDetector
import base64
import io
from PIL import Image
import numpy as np

app = FastAPI(title="ANPR System API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = ANPRDetector()
detection_history = []

@app.get("/")
def root():
    return {"message": "ANPR System API is running", "status": "ok"}

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": detector.model_loaded}

@app.post("/detect")
async def detect_plate(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    img_array = np.array(image)

    result = detector.detect_and_recognize(img_array)

    # Encode annotated image to base64
    annotated_pil = Image.fromarray(result["annotated_image"])
    buffer = io.BytesIO()
    annotated_pil.save(buffer, format="JPEG", quality=90)
    annotated_b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    # Encode cropped plate to base64 if exists
    plate_b64 = None
    if result.get("plate_crop") is not None:
        plate_pil = Image.fromarray(result["plate_crop"])
        pbuffer = io.BytesIO()
        plate_pil.save(pbuffer, format="JPEG", quality=90)
        plate_b64 = base64.b64encode(pbuffer.getvalue()).decode("utf-8")

    detection_id = str(uuid.uuid4())[:8].upper()
    timestamp = datetime.now().isoformat()

    record = {
        "id": detection_id,
        "timestamp": timestamp,
        "filename": file.filename,
        "plate_text": result.get("plate_text", "N/A"),
        "detection_confidence": round(result.get("detection_confidence", 0) * 100, 1),
        "ocr_confidence": round(result.get("ocr_confidence", 0) * 100, 1),
        "state": result.get("state", "Unknown"),
        "plate_type": result.get("plate_type", "Unknown"),
        "bbox": result.get("bbox", []),
        "annotated_image": annotated_b64,
        "plate_crop": plate_b64,
        "preprocessing_applied": result.get("preprocessing_applied", []),
    }

    detection_history.insert(0, {k: v for k, v in record.items() if k not in ["annotated_image", "plate_crop"]})
    if len(detection_history) > 50:
        detection_history.pop()

    return JSONResponse(content=record)

@app.get("/history")
def get_history():
    return {"detections": detection_history, "total": len(detection_history)}

@app.delete("/history")
def clear_history():
    detection_history.clear()
    return {"message": "History cleared"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
