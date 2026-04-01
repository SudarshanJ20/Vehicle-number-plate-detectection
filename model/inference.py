"""
ANPR Inference Script — Single Image / Batch / Webcam
======================================================
Usage:
    # Single image
    python inference.py --source image.jpg

    # Folder of images
    python inference.py --source ./test_images/

    # Webcam (real-time)
    python inference.py --source 0 --webcam

    # Save output
    python inference.py --source image.jpg --save
"""

import argparse
import cv2
import numpy as np
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from detector import ANPRDetector
from preprocess import detect_brightness
from PIL import Image


def parse_args():
    parser = argparse.ArgumentParser(description="ANPR Inference")
    parser.add_argument("--source",  type=str, required=True, help="Image path, folder, or 0 for webcam")
    parser.add_argument("--model",   type=str, default="../backend/best.pt", help="Model weights path")
    parser.add_argument("--conf",    type=float, default=0.25, help="Confidence threshold")
    parser.add_argument("--webcam",  action="store_true", help="Enable webcam mode")
    parser.add_argument("--save",    action="store_true", help="Save annotated output")
    parser.add_argument("--output",  type=str, default="./output/", help="Output folder")
    return parser.parse_args()


def process_image(detector, image_path: str, save: bool, output_dir: str):
    img = cv2.imread(image_path)
    if img is None:
        print(f"[ERROR] Cannot read image: {image_path}")
        return

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    brightness = detect_brightness(img_rgb)
    print(f"\n[INFO] Processing: {image_path}")
    print(f"[INFO] Brightness: {brightness:.1f}/255 {'(Low-light — CLAHE will be applied)' if brightness < 80 else ''}")

    result = detector.detect_and_recognize(img_rgb)

    print(f"[RESULT] Plate Text        : {result['plate_text']}")
    print(f"[RESULT] Detection Conf    : {result['detection_confidence']*100:.1f}%")
    print(f"[RESULT] OCR Confidence    : {result['ocr_confidence']*100:.1f}%")
    print(f"[RESULT] State             : {result['state']}")
    print(f"[RESULT] Plate Type        : {result['plate_type']}")
    print(f"[RESULT] Preprocessing     : {', '.join(result['preprocessing_applied'])}")

    # Show result
    annotated_bgr = cv2.cvtColor(result["annotated_image"], cv2.COLOR_RGB2BGR)
    cv2.imshow("ANPR Detection", annotated_bgr)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    if save:
        os.makedirs(output_dir, exist_ok=True)
        out_path = os.path.join(output_dir, f"result_{os.path.basename(image_path)}")
        cv2.imwrite(out_path, annotated_bgr)
        print(f"[SAVED] {out_path}")


def webcam_mode(detector):
    print("[INFO] Starting webcam... Press 'q' to quit, 's' to capture.")
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        cv2.imshow("ANPR - Press 's' to detect, 'q' to quit", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('s'):
            result = detector.detect_and_recognize(frame_rgb)
            annotated_bgr = cv2.cvtColor(result["annotated_image"], cv2.COLOR_RGB2BGR)
            print(f"\n[CAPTURE] Plate: {result['plate_text']} | State: {result['state']} | Conf: {result['detection_confidence']*100:.1f}%")
            cv2.imshow("Detection Result", annotated_bgr)
            cv2.waitKey(2000)

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    args = parse_args()
    detector = ANPRDetector(model_path=args.model)

    if args.webcam or args.source == "0":
        webcam_mode(detector)
    elif os.path.isdir(args.source):
        exts = ('.jpg', '.jpeg', '.png', '.bmp', '.webp')
        images = [os.path.join(args.source, f) for f in os.listdir(args.source) if f.lower().endswith(exts)]
        print(f"[INFO] Found {len(images)} images in {args.source}")
        for img_path in images:
            process_image(detector, img_path, args.save, args.output)
    else:
        process_image(detector, args.source, args.save, args.output)
