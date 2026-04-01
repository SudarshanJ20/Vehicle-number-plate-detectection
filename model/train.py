"""
YOLO11 Training Script for Indian Vehicle Number Plate Detection
================================================================
Dataset: Roboflow Indian License Plates (YOLO format)
Model:   YOLO11s (small) — balanced speed vs accuracy

Usage:
    python train.py --data data.yaml --epochs 50 --img 640

Steps:
    1. Create a free account at roboflow.com
    2. Search "Indian License Plate" → Export in YOLOv8 format
    3. Place dataset in ./dataset/ folder
    4. Run this script
"""

import argparse
import os
from pathlib import Path

def parse_args():
    parser = argparse.ArgumentParser(description="Train YOLO11 for ANPR")
    parser.add_argument("--data",   type=str, default="dataset/data.yaml", help="Path to data.yaml")
    parser.add_argument("--model",  type=str, default="yolo11s.pt",         help="Pretrained model")
    parser.add_argument("--epochs", type=int, default=50,                   help="Number of epochs")
    parser.add_argument("--img",    type=int, default=640,                  help="Image size")
    parser.add_argument("--batch",  type=int, default=16,                   help="Batch size")
    parser.add_argument("--device", type=str, default="0",                  help="Device: 0 for GPU, cpu for CPU")
    parser.add_argument("--name",   type=str, default="anpr_yolo11",        help="Run name")
    return parser.parse_args()


def train(args):
    try:
        from ultralytics import YOLO
    except ImportError:
        raise ImportError("Run: pip install ultralytics")

    if not Path(args.data).exists():
        raise FileNotFoundError(
            f"Dataset config not found at '{args.data}'.\n"
            "Download from Roboflow: https://universe.roboflow.com/search?q=indian+license+plate"
        )

    print(f"[INFO] Loading pretrained model: {args.model}")
    model = YOLO(args.model)

    print(f"[INFO] Starting training for {args.epochs} epochs...")
    results = model.train(
        data=args.data,
        epochs=args.epochs,
        imgsz=args.img,
        batch=args.batch,
        device=args.device,
        name=args.name,
        # Augmentation (crucial for robustness)
        hsv_h=0.015,     # Hue shift
        hsv_s=0.7,       # Saturation shift
        hsv_v=0.4,       # Brightness shift (handles night plates)
        degrees=10.0,    # Rotation
        translate=0.1,   # Translation
        scale=0.5,       # Scale
        fliplr=0.0,      # No horizontal flip (plate text would be mirrored)
        mosaic=1.0,      # Mosaic augmentation
        blur=0.3,        # Motion blur simulation
        # Hyperparameters
        lr0=0.01,
        lrf=0.01,
        momentum=0.937,
        weight_decay=0.0005,
        warmup_epochs=3,
        patience=20,     # Early stopping
        save=True,
        plots=True,
        verbose=True,
    )

    print(f"\n[DONE] Training complete!")
    print(f"[INFO] Best weights saved to: runs/detect/{args.name}/weights/best.pt")
    print(f"[INFO] Copy best.pt to ../backend/best.pt to use in the API")

    # Validate
    print("\n[INFO] Running validation...")
    metrics = model.val()
    print(f"[RESULTS] mAP@50: {metrics.box.map50:.4f}")
    print(f"[RESULTS] mAP@50-95: {metrics.box.map:.4f}")
    print(f"[RESULTS] Precision: {metrics.box.p[0]:.4f}")
    print(f"[RESULTS] Recall: {metrics.box.r[0]:.4f}")

    return results


if __name__ == "__main__":
    args = parse_args()
    train(args)
