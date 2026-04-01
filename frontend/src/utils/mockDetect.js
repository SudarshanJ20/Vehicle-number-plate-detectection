// Mock detection — used when backend is offline (demo mode)
const PLATES = [
  { plate_text: "MH12AB1234", state: "Maharashtra", plate_type: "Private",    det: 0.94, ocr: 0.91 },
  { plate_text: "DL8CAB2345", state: "Delhi",        plate_type: "Private",    det: 0.88, ocr: 0.85 },
  { plate_text: "KA05MG9876", state: "Karnataka",    plate_type: "Private",    det: 0.96, ocr: 0.93 },
  { plate_text: "TN09BZ4567", state: "Tamil Nadu",   plate_type: "Private",    det: 0.91, ocr: 0.87 },
  { plate_text: "22BH0001AA", state: "BH Series",    plate_type: "BH-Series",  det: 0.89, ocr: 0.82 },
  { plate_text: "UP32GT7890", state: "Uttar Pradesh",plate_type: "Private",    det: 0.93, ocr: 0.90 },
]

export const mockDetect = async (file) => {
  await new Promise(r => setTimeout(r, 1800))
  const pick = PLATES[Math.floor(Math.random() * PLATES.length)]
  const id = Math.random().toString(36).slice(2, 8).toUpperCase()
  return {
    id,
    timestamp: new Date().toISOString(),
    filename: file.name,
    plate_text: pick.plate_text,
    detection_confidence: pick.det * 100,
    ocr_confidence: pick.ocr * 100,
    state: pick.state,
    plate_type: pick.plate_type,
    bbox: [120, 210, 520, 290],
    annotated_image: null,
    plate_crop: null,
    preprocessing_applied: ["Demo Mode — Connect FastAPI backend for real inference"],
    _mock: true,
  }
}
