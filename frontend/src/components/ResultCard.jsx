import { CheckCircle, MapPin, Car, Cpu, AlertTriangle, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import ConfidenceBar from './ConfidenceBar'
import clsx from 'clsx'

export default function ResultCard({ result, originalUrl }) {
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState('annotated')

  const copy = () => {
    navigator.clipboard.writeText(result.plate_text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isMock = result._mock

  return (
    <div className="animate-slide-up space-y-4">
      {/* Mock banner */}
      {isMock && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-400 text-xs">
          <AlertTriangle size={14} />
          <span><strong>Demo Mode</strong> — Start FastAPI backend for real YOLO11 inference</span>
        </div>
      )}

      {/* Plate number hero */}
      <div className="card p-6 text-center space-y-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium">Detected Plate Number</p>
        <div className="flex items-center justify-center gap-3">
          <span className="plate-text text-3xl md:text-4xl font-bold text-brand-600 dark:text-brand-400 tracking-widest">
            {result.plate_text}
          </span>
          <button onClick={copy} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Copy plate number">
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-gray-400" />}
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 pt-1">
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <MapPin size={12} />{result.state}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Car size={12} />{result.plate_type}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <CheckCircle size={12} className="text-emerald-500" />ID: {result.id}
          </span>
        </div>
      </div>

      {/* Images */}
      <div className="card overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          {[
            { key: 'annotated', label: 'Annotated Result' },
            { key: 'original',  label: 'Original Image'  },
            ...(result.plate_crop ? [{ key: 'crop', label: 'Plate Crop' }] : [])
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={clsx('px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
                tab === key
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-950 min-h-48 flex items-center justify-center">
          {tab === 'annotated' && (
            result.annotated_image
              ? <img src={`data:image/jpeg;base64,${result.annotated_image}`} alt="Annotated detection result" className="max-h-80 rounded-lg object-contain w-full" />
              : <MockAnnotated originalUrl={originalUrl} bbox={result.bbox} plateText={result.plate_text} />
          )}
          {tab === 'original' && originalUrl && (
            <img src={originalUrl} alt="Original uploaded vehicle" className="max-h-80 rounded-lg object-contain w-full" />
          )}
          {tab === 'crop' && result.plate_crop && (
            <div className="text-center space-y-2">
              <img src={`data:image/jpeg;base64,${result.plate_crop}`} alt="Cropped plate region" className="max-h-32 rounded-lg object-contain mx-auto border-2 border-brand-500" />
              <p className="text-xs text-gray-400">Extracted plate region (CLAHE enhanced)</p>
            </div>
          )}
        </div>
      </div>

      {/* Confidence metrics */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Cpu size={14} className="text-brand-500" />
          <span className="text-sm font-semibold">Model Confidence</span>
        </div>
        <ConfidenceBar label="YOLO11 Detection Confidence" value={result.detection_confidence} />
        <ConfidenceBar label="EasyOCR Recognition Confidence" value={result.ocr_confidence} />
      </div>

      {/* Preprocessing */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Preprocessing Applied</p>
        <div className="flex flex-wrap gap-2">
          {result.preprocessing_applied.map((step, i) => (
            <span key={i} className="badge bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800 text-xs px-2 py-0.5 rounded-full">
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Canvas-based mock annotated image for demo mode
function MockAnnotated({ originalUrl, bbox, plateText }) {
  if (!originalUrl) return <div className="text-gray-400 text-sm">No image preview</div>

  return (
    <div className="relative inline-block max-h-80">
      <img src={originalUrl} alt="Vehicle with detection overlay" className="max-h-80 rounded-lg object-contain w-full" />
      <div className="absolute inset-0 flex items-end justify-center pb-[25%]">
        <div className="border-2 border-emerald-400 rounded px-3 py-1 bg-black/60 shadow-lg">
          <span className="font-mono text-emerald-400 text-sm font-bold tracking-widest">{plateText}</span>
        </div>
      </div>
    </div>
  )
}
