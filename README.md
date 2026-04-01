# 🚗 ANPR — Deep Learning Vehicle Number Plate Detection

A full-stack Automatic Number Plate Recognition (ANPR) system built with **YOLO11 + EasyOCR + FastAPI + React (Vite)**, optimized for **Indian number plates** including night/low-light conditions.

---

## 📁 Project Structure

```
anpr-project/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── detector.py          # YOLO11 + EasyOCR pipeline
│   ├── preprocess.py        # CLAHE enhancement
│   ├── postprocess.py       # Plate formatting + state lookup
│   └── requirements.txt
├── model/
│   ├── train.py             # YOLO11 training script
│   └── inference.py         # CLI inference (image/folder/webcam)
├── frontend/
│   ├── src/
│   │   ├── pages/           # DetectPage, HistoryPage, DashboardPage, AboutPage
│   │   ├── components/      # Layout, DropZone, ResultCard, ConfidenceBar
│   │   └── utils/           # api.js, mockDetect.js
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Setup & Run

### 1. Clone / Download the project

```bash
cd anpr-project
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Place your trained model
```bash
# After training, copy weights to backend folder:
cp ../model/runs/detect/anpr_yolo11/weights/best.pt ./best.pt
```

#### Start FastAPI server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# API docs at: http://localhost:8000/docs
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App runs at: http://localhost:5173
```

> **Demo Mode**: If the backend is offline, the frontend automatically falls back to mock detection so you can still demo the UI anywhere.

---

## 🏋️ Training the Model

### Step 1 — Get the Dataset
1. Go to [Roboflow Universe](https://universe.roboflow.com)
2. Search **"Indian License Plate"**
3. Export in **YOLOv8 format** → download ZIP
4. Extract to `model/dataset/`

Your `model/dataset/data.yaml` should look like:
```yaml
path: ./dataset
train: images/train
val:   images/val
test:  images/test
nc: 1
names: ['license_plate']
```

### Step 2 — Train on Google Colab (Recommended)
```python
# In Colab:
!pip install ultralytics
!python train.py --data dataset/data.yaml --epochs 50 --img 640 --device 0
```

### Step 3 — Copy weights
```bash
cp runs/detect/anpr_yolo11/weights/best.pt ../backend/best.pt
```

---

## 🖥️ API Endpoints

| Method | Endpoint    | Description                         |
|--------|-------------|-------------------------------------|
| POST   | `/detect`   | Upload image → get plate text + bbox|
| GET    | `/history`  | Get all past detections             |
| DELETE | `/history`  | Clear detection history             |
| GET    | `/health`   | Check server + model status         |

### Example API call
```bash
curl -X POST http://localhost:8000/detect \
  -F "file=@car.jpg" | python -m json.tool
```

---

## 🌟 Unique Features

| Feature | Description |
|---------|-------------|
| 🇮🇳 Indian plates | Supports private, commercial & BH-series plates |
| 🌙 Night detection | CLAHE auto-applied when brightness < 80/255 |
| 🔤 OCR correction | Fixes common misreads: O→0, I→1, S→5 |
| 📊 Analytics | State-wise breakdown + confidence trend charts |
| ⚡ Demo mode | Frontend works without backend for presentations |
| 🎯 YOLO11 | Latest 2024 Ultralytics model |

---

## 📊 Expected Results (after training)

| Metric        | Expected Value |
|---------------|---------------|
| mAP@50        | ~0.92–0.96    |
| mAP@50-95     | ~0.78–0.85    |
| Precision     | ~0.91–0.95    |
| Recall        | ~0.89–0.93    |
| Inference FPS | ~45–60 (GPU)  |

---

## 🛠️ Tech Stack

- **Detection**: YOLO11 (Ultralytics 8.3+)
- **OCR**: EasyOCR 1.7+
- **Preprocessing**: OpenCV + CLAHE
- **Backend**: FastAPI + Uvicorn
- **Frontend**: React 18 + Vite 5 + Tailwind CSS 3
- **Charts**: Recharts
- **Dataset**: Roboflow Indian License Plates

---

## 📝 CLI Inference

```bash
cd model

# Single image
python inference.py --source car.jpg --model ../backend/best.pt

# Folder of images
python inference.py --source ./test_images/ --save

# Webcam (real-time)
python inference.py --source 0 --webcam
```
