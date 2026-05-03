from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from collections import Counter
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

STATE_CORRECTIONS  = {'TM':'TN','KR':'KA','MK':'MH','DI':'DL'}
L2L                = {'0':'O','1':'I','5':'S','8':'B','6':'G','2':'Z'}
D2D                = {'O':'0','I':'1','S':'5','B':'8','G':'6','Z':'2','D':'0'}
NOISE_WORDS        = ['IND','INDIA','IN','ND']
BH_SUFFIX_FIX      = {'L':'A','1':'I','0':'O','D':'O','Q':'O','U':'V','4':'A'}

def clahe(img):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    cl = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8)).apply(l)
    return cv2.cvtColor(cv2.merge([cl,a,b]), cv2.COLOR_LAB2BGR)

def detect_plate_color(crop):
    hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)
    total = crop.shape[0] * crop.shape[1]
    yellow = cv2.countNonZero(cv2.inRange(hsv,(20,80,80),(35,255,255))) / total
    black  = cv2.countNonZero(cv2.inRange(hsv,(0,0,0),(180,255,60)))   / total
    green  = cv2.countNonZero(cv2.inRange(hsv,(40,40,40),(80,255,255)))/ total
    if yellow > 0.15: return 'yellow'
    if black  > 0.25: return 'black'
    if green  > 0.15: return 'green'
    return 'white'

def sort_and_join(ocr_results):
    if not ocr_results:
        return "", 0.0
    heights  = [abs(r[0][2][1] - r[0][0][1]) for r in ocr_results]
    avg_h    = max(np.mean(heights), 10)
    lines    = {}
    for r in ocr_results:
        y_center = np.mean([pt[1] for pt in r[0]])
        lk = round(y_center / avg_h)
        lines.setdefault(lk, []).append(r)
    text, confs = "", []
    for lk in sorted(lines.keys()):
        for item in sorted(lines[lk], key=lambda r: min(pt[0] for pt in r[0])):
            text += item[1]
            confs.append(item[2])
    return text, float(np.mean(confs)) * 100

def remove_noise(raw: str) -> str:
    result = raw.upper()
    for word in NOISE_WORDS:
        if result.startswith(word) and len(result) > len(word):
            result = result[len(word):]
        if result.endswith(word) and len(result) > len(word):
            result = result[:-len(word)]
    return result

def normalize_digits(s: str) -> str:
    return s.replace('I','1').replace('S','5').replace('O','0')\
            .replace('Z','2').replace('G','6').replace('B','8')\
            .replace('A','4')

def plate_score(text: str) -> int:
    t = re.sub(r'[^A-Z0-9]', '', text.upper())
    score = len(t)
    if re.match(r'^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$', t): score += 20
    if re.match(r'^\d{2}BH\d{4}[A-Z]?$', t):           score += 25
    if len(t) >= 2 and t[:2] in STATE_CODES:            score += 10
    if len(t) > 10:                                      score -= 15
    if re.match(r'^\d{2}BH\d{4}[A-Z]$', t):
        if t[-1] in ('L','D','Q','U','X','J','W'):      score -= 5
    return score

def _fix_inner(raw: str) -> str:
    if len(raw) < 4:
        return "UNREADABLE"

    digit_norm = normalize_digits(raw)
    digit_norm = digit_norm.replace('8H','BH')

    m_bh = re.search(r'(\d{1,2})BH(\d{3,4})([A-Z]?)', digit_norm)
    if m_bh:
        num = m_bh.group(1).zfill(2)
        ser = m_bh.group(2).zfill(4)
        suf = BH_SUFFIX_FIX.get(m_bh.group(3), m_bh.group(3))
        return f"{num}BH{ser}{suf}"

    state_pos = -1
    for i in range(len(raw) - 1):
        if raw[i:i+2] in STATE_CODES:
            state_pos = i
            break
    if state_pos > 0:
        raw = raw[state_pos:] + raw[:state_pos]

    if len(raw) >= 2:
        p = raw[:2]
        if p not in STATE_CODES and p in STATE_CORRECTIONS:
            raw = STATE_CORRECTIONS[p] + raw[2:]

    raw = raw[:10]
    c = list(raw)
    for i, ch in enumerate(c):
        if i < 2:    c[i] = L2L.get(ch, ch)
        elif i < 4:  c[i] = D2D.get(ch, ch)
        elif i == 4: c[i] = L2L.get(ch, ch)
        else:        c[i] = D2D.get(ch, ch)
    return ''.join(c)

def fix_plate(raw: str) -> str:
    raw = raw.upper().replace(' ', '')
    raw = re.sub(r'[^A-Z0-9]', '', raw)
    raw = remove_noise(raw)
    if len(raw) < 4:
        return "UNREADABLE"

    variants = [raw, raw[::-1]]
    for noise in NOISE_WORDS:
        if noise in raw:
            cleaned = raw.replace(noise, '')
            variants += [cleaned, cleaned[::-1]]

    best_text, best_score = "UNREADABLE", -999
    for v in variants:
        v = remove_noise(v)
        if len(v) < 4:
            continue
        result = _fix_inner(v)
        s = plate_score(result)
        print(f"    [variant] '{v}' → '{result}' score={s}")
        if s > best_score:
            best_score = s
            best_text  = result
    return best_text

def run_ocr(img, label=""):
    results = reader.readtext(
        img,
        allowlist='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        detail=1,
        paragraph=False
    )
    if not results:
        print(f"  [{label}] No results")
        return None, 0.0
    text, conf = sort_and_join(results)
    fixed = fix_plate(text)
    score = plate_score(fixed)
    print(f"  [{label}] raw='{text}' → fixed='{fixed}' conf={conf:.1f} score={score}")
    return text, conf

def majority_vote(candidates):
    """Majority vote among top-scoring candidates, tie-break by confidence"""
    if not candidates:
        return "UNREADABLE", 0.0
    max_score = max(c[2] for c in candidates)
    top = [c for c in candidates if c[2] == max_score]
    if len(top) == 1:
        return top[0][0], top[0][1]
    # Most frequent result among top scorers
    freq = Counter(c[0] for c in top)
    most_common_text = freq.most_common(1)[0][0]
    # Among ties with same text, pick highest confidence
    best = max([c for c in top if c[0] == most_common_text], key=lambda x: x[1])
    print(f"  [VOTE] {dict(freq)} → '{most_common_text}'")
    return best[0], best[1]

def multi_strategy_ocr(crop):
    h, w = crop.shape[:2]
    big  = cv2.resize(crop, (w*2, h*2), interpolation=cv2.INTER_CUBIC)
    gray = cv2.cvtColor(big, cv2.COLOR_BGR2GRAY)
    plate_color = detect_plate_color(big)
    print(f"  [PLATE COLOR] {plate_color}")

    _, otsu     = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    _, otsu_inv = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    adapt       = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                         cv2.THRESH_BINARY, 11, 2)

    strategies = [
        (big,      "COLOR"),
        (gray,     "GRAY"),
        (otsu,     "OTSU"),
        (otsu_inv, "OTSU_INV"),
        (adapt,    "ADAPTIVE"),
    ]

    print("\n--- OCR STRATEGIES ---")
    candidates = []
    for img_variant, label in strategies:
        t, c = run_ocr(img_variant, label)
        if t:
            f = fix_plate(t)
            s = plate_score(f)
            candidates.append((f, c, s))

    if not candidates:
        return "UNREADABLE", 0.0, plate_color

    best_text, best_conf = majority_vote(candidates)
    best_score = plate_score(best_text)
    print(f"  [WINNER] '{best_text}' score={best_score} conf={best_conf:.1f}")
    print("----------------------\n")
    return best_text, best_conf, plate_color

def get_state(plate, plate_color='white'):
    if re.match(r'^\d{2}BH', plate.upper()):
        return "National (BH)", "BH-Series"
    m = re.match(r'^([A-Z]{2})', plate.upper())
    if m:
        st = STATE_CODES.get(m.group(1), "Unknown")
        if plate_color == 'yellow':  ptype = "Commercial"
        elif plate_color == 'black': ptype = "Rental/Self-Drive"
        elif plate_color == 'green': ptype = "Electric Vehicle"
        else:
            ptype = "Commercial" if re.search(r'\d{2}[A-Z]{2}\d{4}', plate[2:]) else "Private"
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
    plate_color    = 'white'
    annotated = img.copy()

    for r in results:
        for box in r.boxes:
            det_conf = float(box.conf[0]) * 100
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            pad = 6
            x1t = max(0, x1 + pad)
            y1t = max(0, y1 + pad)
            x2t = min(img.shape[1], x2 - pad)
            y2t = min(img.shape[0], y2 - pad)
            crop = img[y1t:y2t, x1t:x2t]
            if crop.size == 0:
                continue

            print(f"[YOLO] conf={det_conf:.1f}% bbox=({x1},{y1},{x2},{y2})")
            plate_text, ocr_conf, plate_color = multi_strategy_ocr(crop)

            cv2.rectangle(annotated, (x1,y1), (x2,y2), (0,255,100), 2)
            cv2.putText(annotated, plate_text, (x1, y1-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,100), 2)
            _, enc = cv2.imencode('.jpg', cv2.resize(crop, None, fx=2, fy=2))
            plate_crop_b64 = base64.b64encode(enc).decode()
            break

    _, ann_enc = cv2.imencode('.jpg', annotated)
    ann_b64 = base64.b64encode(ann_enc).decode()
    state, plate_type = get_state(plate_text, plate_color)

    return {
        "id":                    uuid.uuid4().hex[:6].upper(),
        "plate_text":            plate_text,
        "state":                 state,
        "plate_type":            plate_type,
        "detection_confidence":  round(det_conf, 2),
        "ocr_confidence":        round(ocr_conf, 2),
        "annotated_image":       ann_b64,
        "plate_crop":            plate_crop_b64,
        "preprocessing_applied": ["CLAHE Enhancement","Bicubic Upscale",
                                   "Multi-Strategy OCR","Noise Removal",
                                   "BH Suffix Fix","Majority Vote",
                                   "Color-Aware Type Detection"],
        "filename":              file.filename,
        "timestamp":             datetime.now().isoformat(),
    }