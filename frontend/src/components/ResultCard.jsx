import { useState } from 'react'
import { Copy, Check, MapPin, Car, Cpu, Download, AlertTriangle } from 'lucide-react'
import ConfidenceBar from './ConfidenceBar'
export default function ResultCard({ result, originalUrl }) {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(result.plate_text); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const dl = () => {
    const b = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'anpr-' + result.plate_text + '.json'; a.click()
  }
  return (
    <div className="space-y-4 animate-slide-up">
      {result._mock && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl text-amber-700 dark:text-amber-400 text-xs">
          <AlertTriangle size={14}/>
          <span><strong>Demo Mode</strong> — Connect backend with best.pt for real YOLO11 inference</span>
        </div>
      )}
      <div className="card p-6 text-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Detected Plate</p>
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="plate-text text-4xl font-black text-teal-700 dark:text-teal-400">{result.plate_text}</span>
          <button onClick={copy} className={'p-2.5 rounded-xl transition-all ' + (copied ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-teal-600')}>
            {copied ? <Check size={16}/> : <Copy size={16}/>}
          </button>
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
          <span className="flex items-center gap-1.5 badge bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"><MapPin size={11}/>{result.state}</span>
          <span className="flex items-center gap-1.5 badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"><Car size={11}/>{result.plate_type}</span>
        </div>
        <button onClick={dl} className="btn-secondary text-xs py-1.5 px-3 mx-auto"><Download size={12}/> Export JSON</button>
      </div>
      {originalUrl && (
        <div className="card overflow-hidden">
          <div className="p-4 bg-gray-50 dark:bg-gray-950 relative">
            <img src={originalUrl} alt="Vehicle" className="w-full rounded-xl object-contain max-h-56"/>
            {result.plate_text && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 border-2 border-emerald-400 rounded-lg px-4 py-1.5 bg-black/70 backdrop-blur-sm">
                <span className="font-mono text-emerald-400 font-bold tracking-widest text-sm">{result.plate_text}</span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="card p-5 space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2"><Cpu size={14} className="text-teal-500"/> Model Confidence</h3>
        <ConfidenceBar label="Detection (YOLO11)" value={result.detection_confidence}/>
        <ConfidenceBar label="OCR (EasyOCR)" value={result.ocr_confidence}/>
      </div>
      <div className="card p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Preprocessing</p>
        <div className="flex flex-wrap gap-2">
          {result.preprocessing_applied?.map((s, i) => (
            <span key={i} className="badge bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900 text-xs">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}