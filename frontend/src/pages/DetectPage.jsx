import { useState, useCallback } from 'react'
import { ScanLine, RefreshCw, Zap, WifiOff } from 'lucide-react'
import DropZone from '../components/DropZone'
import ResultCard from '../components/ResultCard'
import { detectPlate } from '../utils/api'
import { mockDetect } from '../utils/mockDetect'
import clsx from 'clsx'

const STATES = { IDLE: 'idle', LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' }

export default function DetectPage({ addToHistory }) {
  const [state, setState] = useState(STATES.IDLE)
  const [result, setResult] = useState(null)
  const [originalUrl, setOriginalUrl] = useState(null)
  const [error, setError] = useState(null)
  const [usedMock, setUsedMock] = useState(false)

  const handleFile = useCallback(async (file) => {
    setState(STATES.LOADING)
    setError(null)
    setResult(null)
    setOriginalUrl(URL.createObjectURL(file))

    let data
    let mock = false
    try {
      data = await detectPlate(file)
    } catch {
      // Fallback to mock if backend is offline
      data = await mockDetect(file)
      mock = true
    }
    setUsedMock(mock)
    setResult(data)
    addToHistory(data)
    setState(STATES.SUCCESS)
  }, [addToHistory])

  const reset = () => {
    setState(STATES.IDLE)
    setResult(null)
    setOriginalUrl(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ScanLine size={20} className="text-brand-500" /> Number Plate Detection
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Upload a vehicle image — YOLO11 detects the plate, EasyOCR reads the text
          </p>
        </div>
        {state === STATES.SUCCESS && (
          <button onClick={reset} className="btn-ghost text-sm">
            <RefreshCw size={14} /> New Detection
          </button>
        )}
      </div>

      {/* Backend status */}
      {usedMock && state === STATES.SUCCESS && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <WifiOff size={12} className="text-amber-500" />
          Backend offline — showing demo results. Run <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">uvicorn main:app</code> for real inference.
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Upload */}
        <div className="space-y-4">
          {state !== STATES.SUCCESS ? (
            <>
              <DropZone onFile={handleFile} disabled={state === STATES.LOADING} />
              {state === STATES.LOADING && <LoadingState />}
            </>
          ) : (
            <div className="card p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Uploaded Image</p>
              <img src={originalUrl} alt="Uploaded vehicle" className="w-full rounded-lg object-contain max-h-64 bg-gray-100 dark:bg-gray-900" />
              <div className="text-xs text-gray-400 font-mono">
                {result?.filename} · {new Date(result?.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}

          {/* Tips */}
          {state === STATES.IDLE && (
            <div className="card p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                <Zap size={12} className="text-brand-500" /> Tips for best results
              </p>
              {[
                'Image should clearly show the number plate',
                'Works for day, night & low-light conditions',
                'Supports Indian plates (private, commercial, BH-series)',
                'CLAHE enhancement auto-applied for dark images',
              ].map((tip, i) => (
                <p key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
                  <span className="text-brand-400 font-bold mt-0.5">·</span> {tip}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Right: Result */}
        <div>
          {state === STATES.SUCCESS && result && (
            <ResultCard result={result} originalUrl={originalUrl} />
          )}
          {state === STATES.IDLE && (
            <div className="card h-full min-h-64 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
                  <ScanLine size={20} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500">Detection result will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="card p-6 space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center animate-pulse-soft">
          <ScanLine size={16} className="text-brand-600" />
        </div>
        <div>
          <p className="text-sm font-semibold">Processing Image...</p>
          <p className="text-xs text-gray-400">Running YOLO11 + EasyOCR pipeline</p>
        </div>
      </div>
      <div className="space-y-2">
        {['Preprocessing & CLAHE Enhancement', 'YOLO11 Plate Detection', 'EasyOCR Text Recognition', 'Post-processing & State Lookup'].map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-brand-300 border-t-brand-600 animate-spin" style={{ animationDelay: `${i * 0.2}s` }} />
            <span className="text-xs text-gray-500 dark:text-gray-400">{step}</span>
          </div>
        ))}
      </div>
      {/* Scan line animation */}
      <div className="scan-container h-2 rounded-full bg-gray-100 dark:bg-gray-800">
        <div className="scan-line" />
      </div>
    </div>
  )
}
