const MOCK = [
  { plate_text:'MH12AB1234', state:'Maharashtra', plate_type:'Private', detection_confidence:93.4, ocr_confidence:91.2 },
  { plate_text:'KA05MG9876', state:'Karnataka',   plate_type:'Private', detection_confidence:91.7, ocr_confidence:89.6 },
  { plate_text:'TN09CD5678', state:'Tamil Nadu',  plate_type:'Commercial', detection_confidence:88.3, ocr_confidence:85.1 },
  { plate_text:'22BH0001AA', state:'National',    plate_type:'BH-Series', detection_confidence:95.2, ocr_confidence:94.8 },
  { plate_text:'DL3CAA0001', state:'Delhi',       plate_type:'Private', detection_confidence:90.1, ocr_confidence:87.4 },
]
export async function mockDetect(file) {
  await new Promise(r => setTimeout(r, 1800))
  const m = MOCK[Math.floor(Math.random() * MOCK.length)]
  return {
    ...m,
    id: Math.random().toString(36).slice(2,8).toUpperCase(),
    filename: file.name,
    annotated_image: null,
    preprocessing_applied: ['CLAHE Enhancement','Bicubic Upscale','Grayscale + Binarize','Noise Reduction'],
    timestamp: new Date().toISOString(),
    _mock: true
  }
}