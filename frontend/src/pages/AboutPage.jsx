import { Info, Github, Cpu, Eye, FileText, Layers } from 'lucide-react'

const STACK = [
  { layer: 'Detection Model', tech: 'YOLO11 (Ultralytics)', detail: 'Latest YOLO architecture — faster & more accurate than YOLOv8', color: 'brand' },
  { layer: 'OCR Engine',      tech: 'EasyOCR',             detail: 'Handles Indian number plates, robust to fonts & angles',     color: 'teal'  },
  { layer: 'Preprocessing',   tech: 'OpenCV + CLAHE',      detail: 'Night/low-light enhancement, sharpening, denoising',        color: 'amber' },
  { layer: 'Backend API',     tech: 'FastAPI (Python)',     detail: 'Async REST API — /detect, /history, /health endpoints',     color: 'green' },
  { layer: 'Frontend',        tech: 'React + Vite',        detail: 'Fast SPA with Recharts analytics & Tailwind CSS',           color: 'purple'},
  { layer: 'Dataset',         tech: 'Roboflow ANPR India', detail: '4000+ annotated Indian plate images, YOLO format',          color: 'rose'  },
]

const PIPELINE = [
  { step: '01', title: 'Image Upload',       desc: 'User uploads vehicle image via drag & drop or file picker' },
  { step: '02', title: 'Brightness Check',   desc: 'Auto-detect low-light conditions (mean brightness < 80/255)' },
  { step: '03', title: 'CLAHE Enhancement',  desc: 'Apply Contrast Limited AHE to improve dark/blurry plates' },
  { step: '04', title: 'YOLO11 Detection',   desc: 'Localize plate region — returns bounding box + confidence' },
  { step: '05', title: 'Plate Crop + Enhance', desc: 'Crop plate, apply CLAHE again for OCR accuracy' },
  { step: '06', title: 'EasyOCR Recognition', desc: 'Extract text from plate crop — returns text + confidence' },
  { step: '07', title: 'Post-processing',    desc: 'Format text, fix OCR misreads (O→0, I→1), extract state' },
  { step: '08', title: 'Result + Analytics', desc: 'Return annotated image, plate text, state, confidence scores' },
]

const colorMap = {
  brand:  'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-800',
  teal:   'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  amber:  'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  green:  'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  rose:   'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
}

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Info size={20} className="text-brand-500" /> About This Project
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Deep Learning–based Automatic Number Plate Recognition (ANPR) System
        </p>
      </div>

      {/* Overview */}
      <div className="card p-6 space-y-3">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 text-sm">
          <Eye size={14} className="text-brand-500" /> Project Overview
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          This ANPR system uses <strong className="text-gray-800 dark:text-gray-200">YOLO11</strong> — the latest model from Ultralytics — to detect vehicle number plates in images, followed by <strong className="text-gray-800 dark:text-gray-200">EasyOCR</strong> to recognize the plate text. The system is specifically optimized for <strong className="text-gray-800 dark:text-gray-200">Indian number plates</strong>, including private, commercial, and BH-series plates, with special handling for low-light and blurry conditions via <strong className="text-gray-800 dark:text-gray-200">CLAHE preprocessing</strong>.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {['Indian Plates', 'Night Detection', 'BH-Series', 'Real-time OCR', 'State Recognition', 'Confidence Scoring'].map(tag => (
            <span key={tag} className="badge bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800 text-xs px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 text-sm">
          <Layers size={14} className="text-brand-500" /> Detection Pipeline
        </h2>
        <div className="space-y-3">
          {PIPELINE.map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 font-mono">{step}</div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 text-sm">
          <Cpu size={14} className="text-brand-500" /> Tech Stack
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {STACK.map(({ layer, tech, detail, color }) => (
            <div key={layer} className={`border rounded-xl p-3 space-y-1 ${colorMap[color]}`}>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{layer}</p>
              <p className="font-bold text-sm">{tech}</p>
              <p className="text-xs opacity-80 leading-snug">{detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Unique features */}
      <div className="card p-6 space-y-3">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 text-sm">
          <FileText size={14} className="text-brand-500" /> What Makes This Unique
        </h2>
        <ul className="space-y-2">
          {[
            '🇮🇳 Indian plate focus — handles old format, new format & BH-series',
            '🌙 CLAHE night enhancement — auto-applies to low-light images',
            '🔤 OCR error correction — fixes common misreads (O→0, I→1, S→5)',
            '📊 Real-time analytics dashboard — state-wise breakdown & confidence trends',
            '⚡ Demo mode — works without backend for instant presentations',
            '🎯 YOLO11 — latest 2024 Ultralytics model, not the outdated YOLOv8',
          ].map((item, i) => (
            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
              <span className="mt-0.5">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
