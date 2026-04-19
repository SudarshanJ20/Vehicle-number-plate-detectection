import { useAuth } from '../context/AuthContext'
import { saveDetection } from '../firebase/detections'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ImagePlus, ScanLine, RotateCcw, CheckCircle2, WifiOff } from 'lucide-react'
import { detectPlate } from '../utils/api'
import { mockDetect } from '../utils/mockDetect'

const STEPS = [
  'Reading & preprocessing image...',
  'CLAHE enhancement...',
  'YOLO11 plate detection...',
  'EasyOCR text recognition...',
  'Post-processing & state lookup...',
]

export default function Demo() {
  const [stage, setStage] = useState('idle')
  const [imgSrc, setImgSrc] = useState(null)
  const [result, setResult] = useState(null)
  const [stepText, setStepText] = useState('')
  const [confWidth, setConfWidth] = useState(0)
  const [mock, setMock] = useState(false)
  const fileRef = useRef()

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      setImgSrc(e.target.result)
      setStage('preview')
      setResult(null)
      setMock(false)
      setConfWidth(0)
    }
    reader.readAsDataURL(file)
  }

  async function analyze() {
    if (!fileRef.current?.files?.[0]) return
    const file = fileRef.current.files[0]

    setStage('processing')
    setStepText(STEPS[0])

    let i = 0
    const iv = setInterval(() => {
      i++
      if (i < STEPS.length) setStepText(STEPS[i])
      else clearInterval(iv)
    }, 500)

    try {
      const data = await detectPlate(file)
      clearInterval(iv)
      setResult(data)
      setStage('result')
      setMock(false)
      setTimeout(() => setConfWidth(data.detection_confidence || 0), 150)
    } catch {
      try {
        const data = await mockDetect(file)
        clearInterval(iv)
        setResult({ ...data, _mock: true })
        setStage('result')
        setMock(true)
        setTimeout(() => setConfWidth(data.detection_confidence || 0), 150)
      } catch {
        clearInterval(iv)
        setStage('idle')
        setStepText('')
      }
    }
  }

  function reset() {
    setStage('idle')
    setImgSrc(null)
    setResult(null)
    setConfWidth(0)
    setMock(false)
    setStepText('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const PanelHeader = ({ title }) => (
    <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02] flex items-center gap-3">
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
      </div>
      <span className="text-slate-500 text-xs font-medium">{title}</span>
    </div>
  )

  return (
    <section id="demo" className="py-24 px-6 bg-[#07070d] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.06] blur-[80px] bg-indigo-500 pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-bold tracking-[0.1em] uppercase text-indigo-400 mb-3"
        >
          ▶ Live Demo
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
        >
          See it in action
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 max-w-xl leading-relaxed mb-14"
        >
          Upload any vehicle image and watch the AI detect, localize, and decode the number plate in real time.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0a12]"
          >
            <PanelHeader title="image-upload.tsx" />
            <div className="p-7">
              {stage === 'idle' && (
                <div
                  onClick={() => fileRef.current.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault()
                    handleFile(e.dataTransfer.files[0])
                  }}
                  className="border-2 border-dashed border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-500/[0.04] rounded-xl p-12 text-center cursor-pointer transition-all"
                >
                  <ImagePlus size={40} className="text-indigo-400 mx-auto mb-4 opacity-70" />
                  <p className="text-white font-semibold mb-1">Drop your vehicle image here</p>
                  <p className="text-slate-500 text-sm">or click to browse files</p>
                  <div className="flex justify-center gap-2 mt-5 flex-wrap">
                    {['JPG', 'PNG', 'WEBP', 'BMP'].map(f => (
                      <span
                        key={f}
                        className="text-[0.68rem] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleFile(e.target.files[0])}
              />

              {['preview', 'processing', 'result'].includes(stage) && imgSrc && (
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <img src={imgSrc} alt="Vehicle" className="w-full h-52 object-cover" />
                  {stage === 'processing' && (
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent scan-line"
                      style={{ boxShadow: '0 0 12px #22d3ee', top: 0 }}
                    />
                  )}
                </div>
              )}

              {stage === 'preview' && (
                <button
                  onClick={analyze}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 rounded-xl transition-all glow-primary"
                >
                  <ScanLine size={16} /> Analyze Image
                </button>
              )}

              {stage === 'processing' && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="w-10 h-10 border-2 border-white/10 border-t-indigo-400 rounded-full animate-spin" />
                  <p className="text-slate-400 text-sm font-medium">{stepText}</p>
                  <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-indigo-400 opacity-60 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {mock && stage === 'result' && (
                <div className="flex items-center gap-2 bg-amber-400/[0.06] border border-amber-400/20 rounded-xl px-4 py-3 text-amber-300 text-sm font-medium">
                  <WifiOff size={15} />
                  Backend offline — showing demo result
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0a12]"
          >
            <PanelHeader title="detection-results.json" />
            <div className="p-7 min-h-[320px] flex flex-col justify-center">
              {stage === 'idle' && (
                <div className="flex flex-col items-center text-slate-600 gap-3 py-10">
                  <ScanLine size={48} className="opacity-30" />
                  <p className="text-sm">Upload an image to see detection results</p>
                </div>
              )}

              {stage === 'result' && result && (
                <div>
                  <div className="relative overflow-hidden rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.07] to-indigo-500/[0.07] p-6 text-center mb-5">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                      Detected Plate Number
                    </p>
                    <p
                      className="font-mono text-3xl font-bold text-white tracking-[0.15em]"
                      style={{ textShadow: '0 0 20px rgba(34,211,238,0.4)' }}
                    >
                      {result.plate_text}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3 text-cyan-400 text-sm font-semibold">
                      <span>Confidence</span>
                      <div className="w-24 h-1 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
                          style={{ width: `${confWidth}%` }}
                        />
                      </div>
                      <span>{(result.detection_confidence ?? 0).toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {[
                      ['State', result.state],
                      ['Plate Type', result.plate_type],
                      ['Filename', result.filename],
                      ['OCR', 'EasyOCR'],
                      ['Detection', `${result.detection_confidence ?? 0}%`],
                      ['OCR Conf.', `${result.ocr_confidence ?? 0}%`],
                    ].map(([k, v]) => (
                      <div key={k} className="glass rounded-xl p-3">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500 mb-1">{k}</p>
                        <p className="text-white font-semibold text-sm break-words">{v}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 bg-emerald-400/[0.06] border border-emerald-400/20 rounded-xl px-4 py-3 text-emerald-400 text-sm font-semibold mb-3">
                    <CheckCircle2 size={15} /> Detection successful — plate number extracted
                  </div>

                  <button
                    onClick={reset}
                    className="w-full flex items-center justify-center gap-2 glass hover:bg-white/[0.07] text-slate-400 hover:text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
                  >
                    <RotateCcw size={14} /> Try Another Image
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}