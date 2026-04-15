from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import base64, uuid, cv2, numpy as np, easyocr, re
from ultralytics import YOLO
from datetime import datetime


app = FastAPI(title="ANPR API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


model  = YOLO("best.pt")
reader = easyocr.Reader(['en'], gpu=False)


STATE_CODES = {
    "MH":"Maharashtra","KA":"Karnataka","TN":"Tamil Nadu","DL":"Delhi",
    "UP":"Uttar Pradesh","GJ":"Gujarat","RJ":"Rajasthan","WB":"West Bengal",
    "AP":"Andhra Pradesh","TS":"Telangana","KL":"Kerala","MP":"Madhya Pradesh",
    "PB":"Punjab","HR":"Haryana","BR":"Bihar","OR":"Odisha","AS":"Assam",
    "HP":"Himachal Pradesh","UK":"Uttarakhand","JK":"Jammu & Kashmir",
    "GA":"Goa","CH":"Chandigarh","MN":"Manipur","TR":"Tripura",
    "NL":"Nagaland","MZ":"Mizoram","SK":"Sikkim","AR":"Arunachal Pradesh",
    "ML":"Meghalaya","CG":"Chhattisgarh","JH":"Jharkhand",
}

OCR_FIX = {'O':'0', 'I':'1', 'S':'5', 'B':'8', 'G':'6', 'Z':'2'}


def clahe(img):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    cl = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8)).apply(l)
    return cv2.cvtColor(cv2.merge([cl,a,b]), cv2.COLOR_LAB2BGR)


def fix_plate(raw: str) -> str:
    raw = raw.upper().replace(' ', '')
    raw = re.sub(r'[^A-Z0-9]', '', raw)
    if not raw:
        return "UNREADABLE"

    # Find valid state code and move to front if plate is reversed
    state_pos = -1
    for i in range(len(raw) - 1):
        if raw[i:i+2] in STATE_CODES:
            state_pos = i
            break
    if state_pos > 0:
        raw = raw[state_pos:] + raw[:state_pos]

    # Fix common OCR misreads in last 4 chars (serial number digits)
    if len(raw) >= 4:
        suffix = list(raw[-4:])
        for i, ch in enumerate(suffix):
            if ch in OCR_FIX:
                suffix[i] = OCR_FIX[ch]
        raw = raw[:-4] + ''.join(suffix)

    return raw


def get_state(plate):
    if re.match(r'^\d{2}BH', plate.upper()):
        return "National (BH)", "BH-Series"
    m = re.match(r'^([A-Z]{2})', plate.upper())
    if m:
        st = STATE_CODES.get(m.group(1), "Unknown")
        ptype = "Commercial" if re.search(r'\d[A-Z]{2}\d{4}', plate[4:]) else "Private"
        return st, ptype
    return "Unknown", "Unknown"


@app.post("/api/detect")
async def detect(file: UploadFile = File(...)):
    data = await file.read()
    arr  = np.frombuffer(data, np.uint8)
    img  = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    enhanced = clahe(img)
    results  = model(enhanced)
    plate_text, det_conf, ocr_conf = "NOT DETECTED", 0.0, 0.0
    plate_crop_b64 = None
    annotated = img.copy()

    for r in results:
        for box in r.boxes:
            det_conf = float(box.conf[0]) * 100
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            crop = img[y1:y2, x1:x2]
            if crop.size == 0:
                continue
            crop = cv2.resize(crop, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
            gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
            _, th = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            ocr_results = reader.readtext(th)
            if ocr_results:
                raw = ''.join([t[1] for t in ocr_results])
                ocr_conf = float(ocr_results[0][2]) * 100
                plate_text = fix_plate(raw)
            cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 255, 100), 2)
            cv2.putText(annotated, plate_text, (x1, y1-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 100), 2)
            _, enc = cv2.imencode('.jpg', crop)
            plate_crop_b64 = base64.b64encode(enc).decode()
            break

    _, ann_enc = cv2.imencode('.jpg', annotated)
    ann_b64 = base64.b64encode(ann_enc).decode()
    state, plate_type = get_state(plate_text)

    return {
        "id": uuid.uuid4().hex[:6].upper(),
        "plate_text": plate_text,
        "state": state,
        "plate_type": plate_type,
        "detection_confidence": round(det_conf, 2),
        "ocr_confidence": round(ocr_conf, 2),
        "annotated_image": ann_b64,
        "plate_crop": plate_crop_b64,
        "preprocessing_applied": ["CLAHE Enhancement", "Bicubic Upscale", "Grayscale + Binarize", "Otsu Threshold"],
        "filename": file.filename,
        "timestamp": datetime.now().isoformat(),
    }