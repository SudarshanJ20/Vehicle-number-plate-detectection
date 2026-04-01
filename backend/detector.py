import cv2
import numpy as np
import re
import os
from preprocess import enhance_image, apply_clahe
from postprocess import format_plate_text, extract_state_from_plate, classify_plate_type

try:
    from ultralytics import YOLO
    import easyocr
    DEPS_AVAILABLE = True
except ImportError:
    DEPS_AVAILABLE = False
    print("[WARN] ultralytics/easyocr not installed. Running in mock mode.")


class ANPRDetector:
    def __init__(self, model_path: str = "best.pt"):
        self.model_loaded = False
        self.model = None
        self.reader = None

        if DEPS_AVAILABLE:
            if os.path.exists(model_path):
                try:
                    self.model = YOLO(model_path)
                    self.model_loaded = True
                    print(f"[INFO] YOLO11 model loaded from {model_path}")
                except Exception as e:
                    print(f"[WARN] Could not load model: {e}. Using mock mode.")
            else:
                print(f"[WARN] Model file '{model_path}' not found. Using mock mode.")

            try:
                self.reader = easyocr.Reader(['en'], gpu=False, verbose=False)
                print("[INFO] EasyOCR reader initialized.")
            except Exception as e:
                print(f"[WARN] EasyOCR init failed: {e}")

    def detect_and_recognize(self, image: np.ndarray) -> dict:
        if self.model_loaded and self.model:
            return self._real_inference(image)
        else:
            return self._mock_inference(image)

    def _real_inference(self, image: np.ndarray) -> dict:
        preprocessing_applied = []
        processed = image.copy()

        # Check if low light
        brightness = np.mean(cv2.cvtColor(image, cv2.COLOR_RGB2GRAY))
        if brightness < 80:
            processed = enhance_image(processed)
            preprocessing_applied.append("CLAHE Night Enhancement")

        # Run YOLO11 detection
        results = self.model(processed, conf=0.25, iou=0.45)
        annotated = processed.copy()

        if not results or len(results[0].boxes) == 0:
            return {
                "plate_text": "No plate detected",
                "detection_confidence": 0.0,
                "ocr_confidence": 0.0,
                "state": "Unknown",
                "plate_type": "Unknown",
                "bbox": [],
                "annotated_image": image,
                "plate_crop": None,
                "preprocessing_applied": preprocessing_applied,
            }

        # Get highest confidence detection
        boxes = results[0].boxes
        best_idx = int(boxes.conf.argmax())
        box = boxes[best_idx]
        conf = float(box.conf[0])
        x1, y1, x2, y2 = map(int, box.xyxy[0])

        # Draw bounding box
        cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 255, 100), 3)
        label = f"Plate {conf*100:.1f}%"
        cv2.putText(annotated, label, (x1, y1 - 12), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 100), 2)

        # Crop plate
        plate_crop = image[y1:y2, x1:x2]
        enhanced_crop = apply_clahe(plate_crop)
        preprocessing_applied.append("Plate Crop Enhancement")

        # OCR
        plate_text = "N/A"
        ocr_conf = 0.0
        if self.reader:
            ocr_results = self.reader.readtext(enhanced_crop)
            if ocr_results:
                best_ocr = max(ocr_results, key=lambda x: x[2])
                raw_text = best_ocr[1]
                ocr_conf = best_ocr[2]
                plate_text = format_plate_text(raw_text)

        state = extract_state_from_plate(plate_text)
        plate_type = classify_plate_type(plate_text)

        return {
            "plate_text": plate_text,
            "detection_confidence": conf,
            "ocr_confidence": ocr_conf,
            "state": state,
            "plate_type": plate_type,
            "bbox": [x1, y1, x2, y2],
            "annotated_image": annotated,
            "plate_crop": enhanced_crop,
            "preprocessing_applied": preprocessing_applied,
        }

    def _mock_inference(self, image: np.ndarray) -> dict:
        """Mock inference for demo/testing without trained model."""
        import random
        sample_plates = [
            ("MH12AB1234", "Maharashtra", "Private"),
            ("DL8CAB2345", "Delhi", "Private"),
            ("KA05MG9876", "Karnataka", "Private"),
            ("TN09BZ4567", "Tamil Nadu", "Private"),
            ("GJ18BH0001", "Gujarat", "BH-Series"),
            ("UP32GT7890", "Uttar Pradesh", "Private"),
            ("HR26DQ5501", "Haryana", "Private"),
        ]
        plate, state, ptype = random.choice(sample_plates)
        det_conf = round(random.uniform(0.82, 0.97), 3)
        ocr_conf = round(random.uniform(0.78, 0.95), 3)

        h, w = image.shape[:2]
        x1, y1 = int(w * 0.2), int(h * 0.55)
        x2, y2 = int(w * 0.8), int(h * 0.75)

        annotated = image.copy()
        cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 255, 100), 3)
        label = f"Plate {det_conf*100:.1f}%"
        cv2.putText(annotated, label, (x1, y1 - 12), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 100), 2)

        plate_crop = image[y1:y2, x1:x2]

        return {
            "plate_text": plate,
            "detection_confidence": det_conf,
            "ocr_confidence": ocr_conf,
            "state": state,
            "plate_type": ptype,
            "bbox": [x1, y1, x2, y2],
            "annotated_image": annotated,
            "plate_crop": plate_crop,
            "preprocessing_applied": ["Mock Mode — Train model for real inference"],
        }
