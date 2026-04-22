import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ClockIcon, ScanLine } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getDetections } from '../firebase/detections'

export default function History() {
  const { user } = useAuth()
  const [detections, setDetections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getUserDetections(user.uid).then(data => {
    setDetections(data)
    setLoading(false)
    })
  }, [user])

  function formatDate(ts) {
    if (!ts) return '—'
    const date = ts.toDate ? ts.toDate() : new Date(ts)
    return date.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <section className="min-h-screen bg-[#07070d] px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-white mb-2"
        >
          Detection History
        </motion.h1>
        <p className="text-slate-500 mb-10">All your past plate detections</p>

        {loading && (
          <div className="flex items-center gap-3 text-slate-500">
            <div className="w-5 h-5 border-2 border-white/10 border-t-indigo-400 rounded-full animate-spin" />
            Loading...
          </div>
        )}

        {!loading && detections.length === 0 && (
          <div className="flex flex-col items-center text-slate-600 gap-3 py-20">
            <ScanLine size={48} className="opacity-30" />
            <p>No detections yet — try scanning a plate!</p>
          </div>
        )}

        {!loading && detections.length > 0 && (
          <div className="grid gap-4">
            {detections.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-white/[0.08] bg-[#0a0a12] p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1">
                  <p className="font-mono text-2xl font-bold text-white tracking-widest mb-1">
                    {d.plateText}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                    <span>🗺️ {d.state || '—'}</span>
                    <span>🏷️ {d.plateType || '—'}</span>
                    <span>🎯 {d.detectionConfidence?.toFixed(1)}%</span>
                    <span>🔤 OCR {d.ocrConfidence?.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 text-xs whitespace-nowrap">
                  <ClockIcon size={13} />
                  {formatDate(d.createdAt)}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}