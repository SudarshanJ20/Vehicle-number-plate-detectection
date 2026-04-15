import re

INDIAN_STATE_CODES = {
    "AN", "AP", "AR", "AS", "BR", "CG", "CH", "DD", "DL", "DN",
    "GA", "GJ", "HP", "HR", "JH", "JK", "KA", "KL", "LA", "LD",
    "MH", "ML", "MN", "MP", "MZ", "NL", "OD", "PB", "PY", "RJ",
    "SK", "TG", "TN", "TR", "TS", "UK", "UP", "WB",
}

INDIAN_STATE_NAMES = {
    "AN": "Andaman & Nicobar", "AP": "Andhra Pradesh", "AR": "Arunachal Pradesh",
    "AS": "Assam", "BR": "Bihar", "CG": "Chhattisgarh", "CH": "Chandigarh",
    "DD": "Daman & Diu", "DL": "Delhi", "DN": "Dadra & Nagar Haveli",
    "GA": "Goa", "GJ": "Gujarat", "HP": "Himachal Pradesh", "HR": "Haryana",
    "JH": "Jharkhand", "JK": "Jammu & Kashmir", "KA": "Karnataka",
    "KL": "Kerala", "LA": "Ladakh", "LD": "Lakshadweep", "MH": "Maharashtra",
    "ML": "Meghalaya", "MN": "Manipur", "MP": "Madhya Pradesh", "MZ": "Mizoram",
    "NL": "Nagaland", "OD": "Odisha", "PB": "Punjab", "PY": "Puducherry",
    "RJ": "Rajasthan", "SK": "Sikkim", "TG": "Telangana", "TN": "Tamil Nadu",
    "TR": "Tripura", "TS": "Telangana", "UK": "Uttarakhand", "UP": "Uttar Pradesh",
    "WB": "West Bengal",
}

OCR_CORRECTIONS = {"O": "0", "I": "1", "S": "5", "B": "8", "G": "6", "Z": "2"}


def format_plate_text(raw: str) -> str:
    text = raw.upper().strip()
    import re as _re
    text = _re.sub(r"[^A-Z0-9]", "", text)
    if not text:
        return "UNREADABLE"
    state_pos = -1
    for i in range(len(text) - 1):
        if text[i:i+2] in INDIAN_STATE_CODES:
            state_pos = i
            break
    if state_pos > 0:
        text = text[state_pos:] + text[:state_pos]
    if len(text) >= 4:
        suffix = list(text[-4:])
        for i, ch in enumerate(suffix):
            if ch in OCR_CORRECTIONS:
                suffix[i] = OCR_CORRECTIONS[ch]
        text = text[:-4] + "".join(suffix)
    return text


def extract_state_from_plate(plate_text: str) -> str:
    if not plate_text or len(plate_text) < 2:
        return "Unknown"
    import re as _re
    if _re.match(r"^\d{2}BH", plate_text):
        return "BH-Series (All India)"
    return INDIAN_STATE_NAMES.get(plate_text[:2].upper(), "Unknown")


def classify_plate_type(plate_text: str) -> str:
    if not plate_text or len(plate_text) < 4:
        return "Unknown"
    import re as _re
    text = plate_text.upper()
    if _re.match(r"^\d{2}BH\d{4}[A-Z]{1,2}$", text):
        return "BH-Series (Bharat)"
    if "CD" in text[:4]:
        return "Diplomat"
    if text.startswith("TEMP") or _re.match(r"^[A-Z]{2}\d{2}T\d+$", text):
        return "Temporary"
    if text[:2] in INDIAN_STATE_CODES:
        return "Private"
    return "Unknown"
