import re

INDIAN_STATE_CODES = {
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

def format_plate_text(raw: str) -> str:
    """Clean and format raw OCR text to standard Indian plate format."""
    text = raw.upper().strip()
    text = re.sub(r'[^A-Z0-9]', '', text)
    # Common OCR misreads
    replacements = {'O': '0', 'I': '1', 'S': '5', 'B': '8', 'G': '6', 'Z': '2'}
    # Only replace in numeric positions (last 4 chars)
    if len(text) >= 4:
        suffix = text[-4:]
        for k, v in replacements.items():
            suffix = suffix.replace(k, v)
        text = text[:-4] + suffix
    return text


def extract_state_from_plate(plate_text: str) -> str:
    """Extract state name from first 2 chars of plate."""
    if len(plate_text) >= 2:
        code = plate_text[:2].upper()
        return INDIAN_STATE_CODES.get(code, "Unknown")
    return "Unknown"


def classify_plate_type(plate_text: str) -> str:
    """Classify plate as Private, Commercial, BH-Series, etc."""
    if len(plate_text) < 4:
        return "Unknown"
    # BH series: YYБHXXXXXX
    if re.match(r'^\d{2}BH', plate_text):
        return "BH-Series (Bharat)"
    # Check district number
    code = plate_text[:2].upper()
    if code in INDIAN_STATE_CODES:
        return "Private"
    return "Unknown"
