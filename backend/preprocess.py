import cv2
import numpy as np


def apply_clahe(image: np.ndarray) -> np.ndarray:
    """Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) for plate enhancement."""
    if len(image.shape) == 3:
        lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        l_eq = clahe.apply(l)
        lab_eq = cv2.merge([l_eq, a, b])
        return cv2.cvtColor(lab_eq, cv2.COLOR_LAB2RGB)
    else:
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        return clahe.apply(image)


def enhance_image(image: np.ndarray) -> np.ndarray:
    """Full enhancement pipeline for low-light or blurry images."""
    # Step 1: CLAHE for contrast
    enhanced = apply_clahe(image)
    # Step 2: Sharpen
    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
    sharpened = cv2.filter2D(enhanced, -1, kernel)
    # Step 3: Denoise
    denoised = cv2.fastNlMeansDenoisingColored(sharpened, None, 10, 10, 7, 21)
    return denoised


def detect_brightness(image: np.ndarray) -> float:
    """Return mean brightness of image (0–255)."""
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    return float(np.mean(gray))


def resize_for_inference(image: np.ndarray, target_size: int = 640) -> np.ndarray:
    """Resize image while maintaining aspect ratio for YOLO input."""
    h, w = image.shape[:2]
    scale = target_size / max(h, w)
    new_w, new_h = int(w * scale), int(h * scale)
    resized = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
    # Pad to square
    top = (target_size - new_h) // 2
    bottom = target_size - new_h - top
    left = (target_size - new_w) // 2
    right = target_size - new_w - left
    padded = cv2.copyMakeBorder(resized, top, bottom, left, right, cv2.BORDER_CONSTANT, value=(114, 114, 114))
    return padded
