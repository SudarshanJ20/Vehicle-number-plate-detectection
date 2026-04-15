import { useState, useCallback } from 'react'
import { ScanLine, RefreshCw, WifiOff } from 'lucide-react'
import DropZone from '../components/DropZone'
import ResultCard from '../components/ResultCard'
import { detectPlate } from '../utils/api'
import { mockDetect } from '../utils/mockDetect'

const STEPS = [
  { label: 'Reading & preprocessing image' },
  { label: 'CLAHE enhancement' },
  { label: 'YOLO11 plate detection' },
  { label: 'EasyOCR text recognition' },
  { label: 'Post-processing & state lookup' },
]

export default function DetectPage({ addToHistory }) {
  const [state, setState] = useState('idle')
  const [result, setResult] = useState(null)
  const [url, setUrl] = useState(null)
  const [step, setStep] = useState(0)
  const [mock, setMock] = useState(false)

  const handleFile = useCallback(async (file) => {
    setState('loading'); setResult(null); setStep(0); setUrl(URL.createObjectURL(file))
    for (let i = 0; i < STEPS.length; i++) { await new Promise(r => setTimeout(r, 320)); setStep(i + 1) }
    let data, m = false
    try { data = await detectPlate(file) } catch { data = await mockDetect(file); m = true }
    setMock(m); setResult(data); addToHistory(data); setState('success')
  }, [addToHistory])

  const reset = () => { setState('idle'); setResult(null); setUrl(null); setStep(0) }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-teal-950 p-6 text-white">
        <h1 className="text-2xl font-black">Vehicle Number Plate<br/><span className="text-teal-300">Detection System</span></h1>
        <p className="text-teal-200 text-sm mt-2">Powered by <strong>YOLO11</strong> + <strong>EasyOCR</strong></p>
        <div className="flex gap-6 mt-4">
          {[{ l:'Model',v:'YOLO11s' },{ l:'mAP@50',v:'~94%' },{ l:'Speed',v:'<100ms' }].map(({ l, v }) => (
            <div key={l}><div className="text-lg font-black">{v}</div><div className="text-teal-300 text-xs">{l}</div></div>
          ))}
        </div>
      </div>
      {mock && state === 'success' && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
          <WifiOff size={14} className="text-amber-500"/>
          <p className="text-xs text-amber-700 dark:text-amber-400">Backend offline — Demo mode. Run <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">uvicorn main:app --reload</code> for real results.</p>
        </div>
      )}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {state === 'idle' && <DropZone onFile={handleFile} disabled={false}/>}
          {state === 'loading' && (
            <div className="card overflow-hidden animate-fade-in">
              {url && <div className="relative bg-gray-950 h-44 overflow-hidden"><img src={url} alt="" className="w-full h-full object-contain opacity-60"/><div className="scan-beam absolute inset-x-0 h-12"/></div>}
              <div className="p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pipeline</p>
                {STEPS.map((s, i) => {
                  const done = i < step, active = i === step - 1
                  return (
                    <div key={i} className={'flex items-center gap-3 px-3 py-2 rounded-xl ' + (active ? 'bg-teal-50 dark:bg-teal-900/20' : '') + (!done && !active ? ' opacity-30' : '')}>
                      <div className={'w-6 h-6 rounded-full flex items-center justify-center text-xs ' + (done ? 'bg-emerald-500 text-white' : active ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400')}>
                        {done ? '✓' : active ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/> : i + 1}
                      </div>
                      <span className={'text-xs font-medium ' + (active ? 'text-teal-700 dark:text-teal-300' : 'text-gray-600 dark:text-gray-400')}>{s.label}</span>
                    </div>
                  )
                })}
                <div className="mt-3 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-500" style={{ width: (step / STEPS.length * 100) + '%' }}/>
                </div>
              </div>
            </div>
          )}
          {state === 'success' && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-500">Uploaded Image</p>
                <button onClick={reset} className="btn-secondary text-xs py-1.5 px-3"><RefreshCw size={12}/> New</button>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-950"><img src={url} alt="" className="w-full rounded-xl object-contain max-h-48"/></div>
            </div>
          )}
        </div>
        <div>
          {state === 'success' && result && <ResultCard result={result} originalUrl={url}/>}
          {(state === 'idle' || state === 'loading') && (
            <div className="card h-full min-h-72 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <ScanLine size={24} className={state === 'loading' ? 'text-teal-500 animate-pulse' : 'text-gray-300 dark:text-gray-600'}/>
                </div>
                <p className="text-sm text-gray-400">{state === 'loading' ? 'Processing...' : 'Result will appear here'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}